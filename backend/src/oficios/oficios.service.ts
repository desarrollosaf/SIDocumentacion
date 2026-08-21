import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { SAF_CONNECTION } from '../config/configuration';
import { Paginated, paginate } from '../common/dto/pagination.dto';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AtencionDoc } from '../entities/doc/atencion-doc.entity';
import { RegistroDoc } from '../entities/doc/registro-doc.entity';
import { ServidorPublico } from '../entities/saf/servidor-publico.entity';
import { CrearOficioDto } from './dto/crear-oficio.dto';
import { FiltroBandejaDto } from './dto/filtro-bandeja.dto';
import { use } from 'passport';
import { HttpService } from '@nestjs/axios';
import { ConnectableObservable, firstValueFrom } from 'rxjs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as qrcode from 'qrcode';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';
import { ConfigService } from '@nestjs/config';
import { text } from 'stream/consumers';


export interface OficioBandeja {
  id: number;
  atencion_id: number | null;
  folio: string | null;
  titulo_doc: string | null;
  fojas: number | null;
  firmado: boolean;
  tipo_atencion: string | null;
  visto: boolean;
  atendido: boolean;
  fecha_visto: Date | null;
  fecha_atencion: Date | null;
  created_at: Date | null;
  /** Contraparte del oficio: remitente en entrada, destinatarios en salida. */
  contraparte: string;
}

@Injectable()
export class OficiosService {
  constructor(
    @InjectRepository(RegistroDoc)
    private readonly registros: Repository<RegistroDoc>,
    @InjectRepository(AtencionDoc)
    private readonly atenciones: Repository<AtencionDoc>,
    @InjectRepository(ServidorPublico, SAF_CONNECTION)
    private readonly servidores: Repository<ServidorPublico>,
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Bandeja de entrada: oficios dirigidos al RFC en sesión.
   * Equivale a RegistroDocumentosController@ofEntrada.
   */
  async bandejaEntrada(
    user: AuthenticatedUser,
    filtro: FiltroBandejaDto,
  ): Promise<Paginated<OficioBandeja>> {
    const query = this.atenciones
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.registroDoc', 'doc')
      .where('a.rfc_atencion = :rfc', { rfc: user.rfc })
      .andWhere('a.activo = 1');

    this.aplicarEstado(query, filtro.estado, 'a.status_atencion');
    this.aplicarFiltrosComunes(query, filtro, 'doc');

    const [rows, total] = await query
      .orderBy('a.id', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    const remitentes = await this.nombresPorRfc(
      rows.map((row) => row.registroDoc?.rfc_registro).filter((rfc): rfc is string => !!rfc),
    );

    const data = rows.map<OficioBandeja>((row) => ({
      id: row.registroDoc!.id,
      atencion_id: row.id,
      folio: row.registroDoc!.folio,
      titulo_doc: row.registroDoc!.titulo_doc,
      fojas: row.registroDoc!.fojas,
      firmado: !!row.registroDoc!.firmado,
      tipo_atencion: row.tipo_atencion,
      visto: !!row.visto,
      atendido: !!row.status_atencion,
      fecha_visto: row.fecha_visto,
      fecha_atencion: row.fecha_atencion,
      created_at: row.created_at,
      contraparte:
        remitentes.get(row.registroDoc!.rfc_registro ?? '') ?? 'Usuario no identificado',
    }));

    return paginate(data, total, filtro);
  }

  /**
   * Bandeja de salida: oficios registrados por el usuario en sesión.
   * Equivale a RegistroDocumentosController@ofSalida.
   */
  async bandejaSalida(
    user: AuthenticatedUser,
    filtro: FiltroBandejaDto,
  ): Promise<Paginated<OficioBandeja>> {
    const query = this.registros
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.destinatarios', 'a')
      .where('doc.rfc_registro = :rfc', { rfc: user.rfc })
      .andWhere('doc.activo = 1');

    // Un oficio enviado cuenta como atendido cuando ningún destinatario vigente
    // sigue pendiente.
    if (filtro.estado === 'atendidos' || filtro.estado === 'pendientes') {
      const existePendiente = `EXISTS (
        SELECT 1 FROM atencion_docs ad
        WHERE ad.id_registro_doc = doc.id AND ad.activo = 1 AND ad.status_atencion = 0
      )`;
      query.andWhere(filtro.estado === 'atendidos' ? `NOT ${existePendiente}` : existePendiente);
    }

    this.aplicarFiltrosComunes(query, filtro, 'doc');

    const [rows, total] = await query
      .orderBy('doc.created_at', 'DESC')
      .skip((filtro.page - 1) * filtro.perPage)
      .take(filtro.perPage)
      .getManyAndCount();

    const nombres = await this.nombresPorRfc(
      rows.flatMap((doc) => (doc.destinatarios ?? []).map((d) => d.rfc_atencion)),
    );

    const data = rows.map<OficioBandeja>((doc) => {
      const destinatarios = doc.destinatarios ?? [];
      return {
        id: doc.id,
        atencion_id: null,
        folio: doc.folio,
        titulo_doc: doc.titulo_doc,
        fojas: doc.fojas,
        firmado: !!doc.firmado,
        tipo_atencion: null,
        // En salida "visto"/"atendido" resumen el avance de todos los destinatarios.
        visto: destinatarios.length > 0 && destinatarios.every((d) => !!d.visto),
        atendido: destinatarios.length > 0 && destinatarios.every((d) => !!d.status_atencion),
        fecha_visto: null,
        fecha_atencion: null,
        created_at: doc.created_at,
        contraparte:
          destinatarios
            .map((d) => nombres.get(d.rfc_atencion) ?? d.rfc_atencion)
            .join(', ') || 'Sin destinatarios',
      };
    });

    return paginate(data, total, filtro);
  }

  /** Detalle del oficio con sus destinatarios resueltos. Equivale a @verEnvioDoc. */
  async detalle(id: number) {
    const doc = await this.registros.findOne({
      where: { id },
      relations: { destinatarios: true },
    });

    if (!doc) {
      throw new NotFoundException('El oficio solicitado no existe.');
    }

    const nombres = await this.nombresPorRfc([
      ...(doc.destinatarios ?? []).flatMap((d) => [d.rfc_atencion, d.rfc_turna ?? '']),
      doc.rfc_registro ?? '',
    ]);

    return {
      ...doc,
      remitente: nombres.get(doc.rfc_registro ?? '') ?? 'Usuario no identificado',
      destinatarios: (doc.destinatarios ?? []).map((d) => ({
        ...d,
        nombre: nombres.get(d.rfc_atencion) ?? d.rfc_atencion,
        turnado_por: d.rfc_turna ? (nombres.get(d.rfc_turna) ?? d.rfc_turna) : null,
      })),
    };
  }

  /** Registra el oficio y sus destinatarios. Equivale a @saveDoc. */
  async crear(user: AuthenticatedUser, dto: CrearOficioDto, file: any) {
  
    const doc = await this.registros.save(
      this.registros.create({
        folio: dto.folio ?? null,
        titulo_doc: dto.titulo_doc,
        fojas: dto.fojas ?? null,
        serie_id: dto.serie_id ?? null,
        subserie_id: dto.subserie_id ?? null,
        expediente_id: dto.expediente_id ?? null,
        tipo_doc: dto.tipo_doc ?? null,
        rfc_registro: user.rfc,
        firmado: dto.firmado ?? false,
        status: 1,
        activo: 1,
        created_at: new Date(),
        updated_at: new Date()
      }),
    );

    for (const destinatario of dto.destinatarios) {
      const registroAtencion = await this.atenciones.findOne({
        where: {
          rfc_atencion: destinatario.rfc,
          id_registro_doc: doc.id,
        },
      });

      if (registroAtencion) {
        // Ya existe → actualizar
        registroAtencion.tipo_atencion = registroAtencion.tipo_atencion + ',' + destinatario.tipo_atencion;
        registroAtencion.updated_at = new Date();
        await this.atenciones.save(registroAtencion);
      } else {
        // No existe → crear
        const nuevaAtencion = this.atenciones.create({
          id_registro_doc: doc.id,
          rfc_atencion: destinatario.rfc,
          tipo_atencion: destinatario.tipo_atencion,
          rfc_turna: user.rfc,
          visto: 0,
          status_atencion: 0,
          activo: 1,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await this.atenciones.save(nuevaAtencion);
      }
    }

    const nombreCarpeta = String(user.c_presup);
    const directorio = path.join(
      process.cwd(),
      'storage',
      'files',
      'documentacion',
      'oficios',
      nombreCarpeta,
    );

    await fs.mkdir(directorio, {
      recursive: true,
    });
    const uuid = randomUUID();

    const nombreOriginal = file.originalname

    const rutaArchivo = path.join(
      directorio,
      `${uuid}.pdf`,
    );

    await fs.writeFile(
      rutaArchivo,
      file.buffer,
    );
    const pathPdf =`documentacion/oficios/${nombreCarpeta}/${uuid}.pdf`;

    doc.path_doc = pathPdf;
    doc.uuid_doc = uuid;

    const fecha = new Date;
    const hoy = fecha.toISOString().slice(0, 19).replace('T', ' ');

    //estampar
     const datosE = {
        pathPdf: pathPdf,
        nombreCarpeta: nombreCarpeta,
        uuid: uuid,
        uuidQr: uuid,
        nombreServidor: user.nombre,
        hash: dto.hash,
        fecha: hoy,
      }
    const resp = this.estampar(datosE);

    //acusar
    const datosA = {
      carpeta: nombreCarpeta,
      uuid: uuid, 
      hash: dto.hash,
      hoy: hoy,
      remitente: user.nombre,
      qr: (await resp).qrImage,
    };

    const acuse = this.acuse(datosA);
  
    doc.path_doc = pathPdf;
    doc.uuid_doc = uuid;

    doc.path_acuse = (await acuse).path_acuse;
    doc.uuid_acuse = (await acuse).uuid_acuse;

    await this.registros.save(doc);


    if(doc.firmado == true){
    const datosF = {
      path: pathPdf,
      rfc: user.rfc,
      docI: uuid, 
      psw: dto.psw,
      firma_status: '1',
      tipo_firmante: null,
    } 
    //firmar doc
    this.firmarDoc(datosF);

    const regAt = await this.atenciones.findOne({
        where: {
          rfc_atencion: user.rfc,
          id_registro_doc: doc.id,
        },
      });

    if(regAt){
      const tipos = regAt.tipo_atencion.split(',');
      for (const tipo of tipos) {
        const datosFA = {
              path: (await acuse).path_acuse,
              rfc: user.rfc,
              docI: uuid, 
              psw: dto.psw,
              firma_status: 0,
              tipo_firmante: tipo,
            };
        this.firmarDoc(datosFA);
      }
    }
   
    }

    return this.detalle(doc.id);
  }

  /** Marca el oficio como visto. Equivale a NotificacionController@vistoEntrada. */
  async marcarVisto(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    if (!atencion.visto) {
      await this.atenciones.update(atencion.id, { visto: 1, fecha_visto: new Date() });
    }

    return { message: 'Oficio marcado como visto.' };
  }

  /** Cierra la atención del oficio para el usuario en sesión. */
  async atender(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atencionPropia(user, atencionId);

    await this.atenciones.update(atencion.id, {
      status_atencion: 1,
      fecha_atencion: new Date(),
      visto: 1,
      fecha_visto: atencion.fecha_visto ?? new Date(),
    });

    return { message: 'El oficio se marcó como atendido.' };
  }

  async validarPsw(user: AuthenticatedUser, psw: string){
    const datos = {
      'rfc': user.rfc,
      'password': psw
    }
    const feplemUrl = this.configService.get<string>('feplem.baseUrl');
    try {
      const response = await firstValueFrom(
        this.http.post(
          feplemUrl+'/api/validaCertificados',
          datos,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      
      const resp = {
        hash: String(response.data)
      }
      return resp;
    } catch (error: any) {
      return error.response?.data;
    } 
  }

  async validarFirmado(user: AuthenticatedUser, id: number){
    const registro = await this.registros.findOne({
      where:{
        id: id
      },
      relations:{
        destinatarios: true
      }
    })

    if(registro?.rfc_registro != user.rfc){
      const destinatario = registro?.destinatarios?.find(
        (d) => d.rfc_atencion === user.rfc
      );

      if(destinatario?.visto == 0){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }

  /** Totales que alimentan el tablero y las insignias del menú. */
  async resumen(user: AuthenticatedUser) {
    const [entradaPendientes, entradaSinVer, salidaTotal] = await Promise.all([
      this.atenciones.count({
        where: { rfc_atencion: user.rfc, status_atencion: 0, activo: 1 },
      }),
      this.atenciones.count({ where: { rfc_atencion: user.rfc, visto: 0, activo: 1 } }),
      this.registros.count({ where: { rfc_registro: user.rfc, activo: 1 } }),
    ]);

    return { entradaPendientes, entradaSinVer, salidaTotal };
  }

  private async atencionPropia(user: AuthenticatedUser, atencionId: number) {
    const atencion = await this.atenciones.findOne({
      where: { id: atencionId, rfc_atencion: user.rfc },
    });

    if (!atencion) {
      throw new NotFoundException('El oficio no está dirigido a tu bandeja.');
    }

    return atencion;
  }

  /** Folio consecutivo por año, con el formato del sistema original. */
  private async siguienteFolio(): Promise<string> {
    const anio = new Date().getFullYear();
    const total = await this.registros
      .createQueryBuilder('doc')
      .where('YEAR(doc.created_at) = :anio', { anio })
      .getCount();

    return `${anio}-${String(total + 1).padStart(5, '0')}`;
  }

  /** Resuelve nombres desde el padrón SAF en una sola consulta. */
  private async nombresPorRfc(rfcs: string[]): Promise<Map<string, string>> {
    const unicos = [...new Set(rfcs.filter(Boolean))];
    if (!unicos.length) {
      return new Map();
    }

    const servidores = await this.servidores.find({ where: { N_Usuario: In(unicos) } });
    return new Map(
      servidores.map((s) => [s.N_Usuario, s.Nombre ?? 'Usuario no identificado']),
    );
  }

  private aplicarEstado(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    estado: FiltroBandejaDto['estado'],
    campo: string,
  ) {
    if (estado === 'pendientes') {
      query.andWhere(`${campo} = 0`);
    } else if (estado === 'atendidos') {
      query.andWhere(`${campo} = 1`);
    }
  }

  private aplicarFiltrosComunes(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    filtro: FiltroBandejaDto,
    alias: string,
  ) {
    if (filtro.search) {
      query.andWhere(
        `(${alias}.folio LIKE :search OR ${alias}.titulo_doc LIKE :search)`,
        { search: `%${filtro.search}%` },
      );
    }
    if (filtro.serie_id) {
      query.andWhere(`${alias}.serie_id = :serie`, { serie: filtro.serie_id });
    }
    if (filtro.desde && filtro.hasta) {
      query.andWhere(`${alias}.created_at BETWEEN :desde AND :hasta`, {
        desde: `${filtro.desde} 00:00:00`,
        hasta: `${filtro.hasta} 23:59:59`,
      });
    }
  }

  async estampar(datosE: any){

    const pathDoc = path.join(
      process.cwd(),
      'storage',
      'files',
      datosE.pathPdf,
    );

    // 1. Leer PDF original
    const pdfBytes = await fs.readFile(pathDoc);
    const pdfOriginal = await PDFDocument.load(pdfBytes);
  
    // 2. Crear PDF nuevo
    const pdfNuevo = await PDFDocument.create();

    // 3. Copiar todas las páginas
    const paginas = await pdfNuevo.copyPages(
      pdfOriginal,
      pdfOriginal.getPageIndices(),
    );
    const feplemUrl = this.configService.get<string>('feplem.baseUrl');
    // 4. Generar QR
    const urlQr =feplemUrl+`/d/${datosE.nombreCarpeta},${datosE.uuid}`;

    const qrPng = await qrcode.toDataURL(urlQr, {
      width: 100,
      margin: 1,
    });
    // quitar encabezado data:image/png;base64,
    const qrBase64 = qrPng.split(',')[1];
    const qrBytes = Buffer.from(qrBase64, 'base64');
    const qrImage = await pdfNuevo.embedPng(qrBytes);

    // 5. Fuente
    const font = await pdfNuevo.embedFont(
      StandardFonts.Helvetica,
    );

    const fontBold = await pdfNuevo.embedFont(
      StandardFonts.HelveticaBold,
    );

    // 6. Agregar cada página
    paginas.forEach((pagina: any, index: any) => {
      const page = pdfNuevo.addPage(pagina);
      const { width, height } = page.getSize();

      // =========================
      // POSICIÓN DEL QR
      // =========================

      const qrX = width - 225;
      const qrY = height -760;

      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: 40,
        height: 40,
      });

      // =========================
      // DATOS
      // =========================

      const textX = qrX + 43;

      page.drawText('Elaboró:', {
        x: textX,
        y: qrY + 35,
        size: 4,
        font: fontBold,
      });

      page.drawText(datosE.nombreServidor, {
        x: textX + 20,
        y: qrY + 35,
        size: 4,
        font,
      });

      page.drawText(
        this.formatearFecha(datosE.fecha),
        {
          x: textX + 100,
          y: qrY + 35,
          size: 4,
          font,
        },
      );

      // =========================
      // HASH
      // =========================

      page.drawText('Hash:', {
        x: textX,
        y: qrY + 30,
        size: 4,
        font: fontBold,
      });

      page.drawText(datosE.hash, {
        x: textX + 15,
        y: qrY + 30,
        size: 4,
        font,
        maxWidth: 100,
      });

      // =========================
      // UUID
      // =========================

      page.drawText(
        'Identificador único del documento:',
        {
          x: textX,
          y: qrY + 25,
          size: 4,
          font: fontBold,
        },
      );

      page.drawText(datosE.uuid, {
        x: textX + 75,
        y: qrY + 25,
        size: 4,
        font,
      });

      // =========================
      // TEXTO DE VALIDACIÓN
      // =========================

      const texto =
        'Para verificar la integridad de este documento, ' +
        'favor de escanear el código QR o visitar el enlace ' +
        'https://feplem.gob.mx/validar-documento. ' +
        'Para mayor información ingrese a: ' +
        'https://feplem.gob.mx';

      this.drawTextWrapped(
        page,
        texto,
        {
          x: textX,
          y: qrY + 20,
          maxWidth: 160,
          size: 4,
          lineHeight: 5,
          font,
        },
      );

      // =========================
      // PÁGINA
      // =========================

      page.drawText(
        `Página: ${index + 1}/${paginas.length}`,
        {
          x: textX,
          y: qrY + 5,
          size: 4,
          font,
        },
      );
    });
    
    // 7. Guardar PDF
    const pdfFinal = await pdfNuevo.save();

    const directorio = path.dirname(datosE.pathPdf);
  
    const directorioN = path.join(
      process.cwd(),
      'storage',
      'files',
      directorio
    );

    await fs.mkdir(directorioN, {
      recursive: true,
    });

    const nuevoPath = path.join(
      directorioN,
      `${datosE.uuid}.pdf`,
    );
    
    await fs.writeFile(
      nuevoPath,
      pdfFinal,
      { flag: 'w'}
    );

    const resp ={
      qrImage: qrImage, 
      nuevoPath: nuevoPath,
    }
    return resp;
  }

  private formatearFecha(fecha: Date | string): string {
    const date = fecha instanceof Date
    ? fecha
    : new Date(fecha);

    const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}Z`;
  }

  private drawTextWrapped(
    page: any,
    text: string,
    options: {
      x: number;
      y: number;
      maxWidth: number;
      size: number;
      lineHeight: number;
      font: any;
    },
  ) {

    const palabras = text.split(' ');

    let linea = '';
    let y = options.y;

    for (const palabra of palabras) {

      const prueba =
        linea.length > 0
          ? `${linea} ${palabra}`
          : palabra;

      const ancho =
        options.font.widthOfTextAtSize(
          prueba,
          options.size,
        );

      if (ancho > options.maxWidth) {

        page.drawText(linea, {
          x: options.x,
          y,
          size: options.size,
          font: options.font,
        });

        linea = palabra;
        y -= options.lineHeight;

      } else {
        linea = prueba;
      }
    }

    if (linea) {
      page.drawText(linea, {
        x: options.x,
        y,
        size: options.size,
        font: options.font,
      });
    }
  }

  async firmarDoc(datosF: any){
    const data = {
      path: datosF.path,
      user_rfc: datosF.rfc,
      contra: datosF.psw,
      docI: datosF.docI,
      tipo: 'documentacion/oficios',
      firma_status: datosF.firma_status,
      status_doc: '1',
      firma: 8,
      tipo_firmante: datosF.tipo_firmante,
      fecha_expedicion: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      fecha_certificacion: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    };
    const feplemUrl = this.configService.get<string>('feplem.baseUrl');
    try {
      const response = await firstValueFrom(
        this.http.post(
          feplemUrl+'/api/firmaDocumentos',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data;
      console.log(
        'Respuesta firma:',
        response.data,
      );
    } catch (error) {
      return console.error(error);
    }
  }

  async acuse(datos: any){
    const uuidQr = randomUUID();
    const uuidA = randomUUID();
    
    const fondoPath = path.join(
      process.cwd(),
      'storage',
      'images',
      'fondo_acuse.png',
    );

    const directorio = path.join(
      process.cwd(),
      'storage',
      'files',
      'documentacion',
      'oficios',
      datos.carpeta,
    );

    await fs.mkdir(directorio, {
      recursive: true,
    });

    const nuevoPathAcuse = path.join(
      directorio,
      `${datos.uuid}_acuse.pdf`,
    );

    // ---------------------------------------
    // Crear PDF
    // ---------------------------------------

    const pdfDoc = await PDFDocument.create();

    // Letter = 612 x 792 puntos
    const page = pdfDoc.addPage([612, 792]);

    // ---------------------------------------
    // Fuentes
    // ---------------------------------------

    const fontBold = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold,
    );

    const fontNormal = await pdfDoc.embedFont(
      StandardFonts.Helvetica,
    );

    // ---------------------------------------
    // Fondo
    // ---------------------------------------

    const fondoBytes = await fs.readFile(fondoPath);

    const fondo = await pdfDoc.embedPng(fondoBytes);

    page.drawImage(fondo, {
      x: 0,
      y: 0,
      width: 612,
      height: 792,
    });

    // ---------------------------------------
    // Título
    // ---------------------------------------

    page.drawText('Acuse de recibo', {
      x: 255,
      y: 792 - 165,
      size: 12,
      font: fontBold,
    });

    // ---------------------------------------
    // QR
    // ---------------------------------------
    const feplemUrl = this.configService.get<string>('feplem.baseUrl');
    const urlQr = feplemUrl+`/d/${datos.carpeta},${datos.uuid}`;

    const qrPng = await qrcode.toDataURL(urlQr, {
      width: 100,
      margin: 1,
    });
    // quitar encabezado data:image/png;base64,
    const qrBase64 = qrPng.split(',')[1];
    const qrBytes = Buffer.from(qrBase64, 'base64');
    const qrImage = await pdfDoc.embedPng(qrBytes);

    page.drawImage(qrImage, {
      x: 319,
      y: 792 - 774,
      width: 55,
      height: 55,
    });
    // ---------------------------------------
    // Remitente
    // ---------------------------------------

    page.drawText(datos.remitente ?? '', {
      x: 380,
      y: 792 - 734,
      size: 5,
      font: fontNormal,
    });

    // ---------------------------------------
    // Fecha
    // ---------------------------------------

    page.drawText(datos.hoy ?? '', {
      x: 500,
      y: 792 - 734,
      size: 5,
      font: fontNormal,
    });

    // ---------------------------------------
    // Hash
    // ---------------------------------------

    page.drawText(datos.hash ?? '', {
      x: 380,
      y: 792 - 749,
      size: 5,
      font: fontNormal,
    });

    // ---------------------------------------
    // UUID
    // ---------------------------------------

    page.drawText(uuidA, {
      x: 380,
      y: 792 - 764,
      size: 5,
      font: fontNormal,
    });

    // ---------------------------------------
    // UUID nuevamente
    // ---------------------------------------

    page.drawText(uuidA, {
      x: 380,
      y: 792 - 779,
      size: 5,
      font: fontNormal,
    });

    // ---------------------------------------
    // Guardar PDF
    // ---------------------------------------

    const pdfFinal = await pdfDoc.save();

    await fs.writeFile(
      nuevoPathAcuse,
      pdfFinal,
      { flag: 'w' },
    );

    // ---------------------------------------
    // Datos que guardarías en BD
    // ---------------------------------------

    const pathPdfAcu =
      `documentacion/oficios/${datos.carpeta}/${datos.uuid}_acuse.pdf`;

    return {
      path_acuse: pathPdfAcu,
      uuid_acuse: uuidA,
    };
  }

  async verPdf(id: number, tipo: number): Promise<string>{
    const registro = await this.registros.findOne({
      where:{
        id: id
      }
    }); 

    const pathDoc = tipo === 1
      ? registro?.path_doc
      : tipo === 2
      ? registro?.path_acuse
      : null;

    const ruta = path.join(
      process.cwd(),
      'storage',
      'files',
      pathDoc ?? '',
    );
    return ruta;
  }

async firmarDocAcuse(id: number, psw: string, user:AuthenticatedUser){
    const registro = await this.registros.findOne({
      where:{
        id: id
      },
      relations:{
        destinatarios: true
      }
    });

     if(registro?.rfc_registro != user.rfc){
      const destinatario = registro?.destinatarios?.find(
        (d) => d.rfc_atencion === user.rfc
      );

    if(destinatario){
      const at = destinatario.tipo_atencion.split(',');
      let firma;
      let firmaA;
      for (const element of at) {
          const datos = {
            path: registro?.path_acuse,
            user_rfc: user.rfc,
            contra: psw,
            docI: registro?.uuid_doc,
            tipo: 'documentacion/oficios',
            firma_status: '0',
            status_doc: '1',
            firma: 8,
            tipo_firmante: element,
            fecha_expedicion: new Date,
            fecha_certificacion: new Date
          }
          firmaA = await this.firmarAcuse(datos);
        }
         const datos = {
            path: registro?.path_doc,
            user_rfc: user.rfc,
            contra: psw,
            docI: registro?.uuid_doc,
            tipo: 'documentacion/oficios',
            firma_status: '1',
            status_doc: '1',
            firma: 8,
            tipo_firmante: null,
            fecha_expedicion: new Date,
            fecha_certificacion: new Date
          }
          firma = await this.firmarAcuse(datos);
        if(firma === 1){
          this.atenciones.update(
            { id: destinatario.id },
            { visto: 1, fecha_visto: new Date() },
          );
           return 1;
        }else{
          console.log('reteno de firma ', firma)
          return firma;
        }
    }
  }
}

  async firmarAcuse(datos: any){
    const feplemUrl = this.configService.get<string>('feplem.baseUrl');
    console.log('datos para firmar', datos)
    try {
      const response = await firstValueFrom(
        this.http.post(
          feplemUrl+'/api/firmaDocumentos',
          datos,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }, 
        ),
      );
      return response.data;
    } catch (error: any) {
      return error.response?.data;
    } 
  }
}

