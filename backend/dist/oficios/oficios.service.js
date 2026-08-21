"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OficiosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configuration_1 = require("../config/configuration");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const atencion_doc_entity_1 = require("../entities/doc/atencion-doc.entity");
const registro_doc_entity_1 = require("../entities/doc/registro-doc.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const pdf_lib_1 = require("pdf-lib");
const qrcode = __importStar(require("qrcode"));
const config_1 = require("@nestjs/config");
let OficiosService = class OficiosService {
    registros;
    atenciones;
    servidores;
    http;
    configService;
    constructor(registros, atenciones, servidores, http, configService) {
        this.registros = registros;
        this.atenciones = atenciones;
        this.servidores = servidores;
        this.http = http;
        this.configService = configService;
    }
    async bandejaEntrada(user, filtro) {
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
        const remitentes = await this.nombresPorRfc(rows.map((row) => row.registroDoc?.rfc_registro).filter((rfc) => !!rfc));
        const data = rows.map((row) => ({
            id: row.registroDoc.id,
            atencion_id: row.id,
            folio: row.registroDoc.folio,
            titulo_doc: row.registroDoc.titulo_doc,
            fojas: row.registroDoc.fojas,
            firmado: !!row.registroDoc.firmado,
            tipo_atencion: row.tipo_atencion,
            visto: !!row.visto,
            atendido: !!row.status_atencion,
            fecha_visto: row.fecha_visto,
            fecha_atencion: row.fecha_atencion,
            created_at: row.created_at,
            contraparte: remitentes.get(row.registroDoc.rfc_registro ?? '') ?? 'Usuario no identificado',
        }));
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async bandejaSalida(user, filtro) {
        const query = this.registros
            .createQueryBuilder('doc')
            .leftJoinAndSelect('doc.destinatarios', 'a')
            .where('doc.rfc_registro = :rfc', { rfc: user.rfc })
            .andWhere('doc.activo = 1');
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
        const nombres = await this.nombresPorRfc(rows.flatMap((doc) => (doc.destinatarios ?? []).map((d) => d.rfc_atencion)));
        const data = rows.map((doc) => {
            const destinatarios = doc.destinatarios ?? [];
            return {
                id: doc.id,
                atencion_id: null,
                folio: doc.folio,
                titulo_doc: doc.titulo_doc,
                fojas: doc.fojas,
                firmado: !!doc.firmado,
                tipo_atencion: null,
                visto: destinatarios.length > 0 && destinatarios.every((d) => !!d.visto),
                atendido: destinatarios.length > 0 && destinatarios.every((d) => !!d.status_atencion),
                fecha_visto: null,
                fecha_atencion: null,
                created_at: doc.created_at,
                contraparte: destinatarios
                    .map((d) => nombres.get(d.rfc_atencion) ?? d.rfc_atencion)
                    .join(', ') || 'Sin destinatarios',
            };
        });
        return (0, pagination_dto_1.paginate)(data, total, filtro);
    }
    async detalle(id) {
        const doc = await this.registros.findOne({
            where: { id },
            relations: { destinatarios: true },
        });
        if (!doc) {
            throw new common_1.NotFoundException('El oficio solicitado no existe.');
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
    async crear(user, dto, file) {
        const doc = await this.registros.save(this.registros.create({
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
        }));
        await this.atenciones.save(dto.destinatarios.map((destinatario) => this.atenciones.create({
            id_registro_doc: doc.id,
            rfc_atencion: destinatario.rfc,
            tipo_atencion: destinatario.tipo_atencion,
            rfc_turna: user.rfc,
            visto: 0,
            status_atencion: 0,
            activo: 1,
            created_at: new Date(),
            updated_at: new Date()
        })));
        const nombreCarpeta = String(user.c_presup);
        const directorio = path.join(process.cwd(), 'storage', 'files', 'documentacion', 'oficios', nombreCarpeta);
        await fs_1.promises.mkdir(directorio, {
            recursive: true,
        });
        const uuid = (0, crypto_1.randomUUID)();
        const nombreOriginal = file.originalname;
        const rutaArchivo = path.join(directorio, `${uuid}.pdf`);
        await fs_1.promises.writeFile(rutaArchivo, file.buffer);
        const pathPdf = `documentacion/oficios/${nombreCarpeta}/${uuid}.pdf`;
        doc.path_doc = pathPdf;
        doc.uuid_doc = uuid;
        const fecha = new Date;
        const hoy = fecha.toISOString().slice(0, 19).replace('T', ' ');
        const datosE = {
            pathPdf: pathPdf,
            nombreCarpeta: nombreCarpeta,
            uuid: uuid,
            uuidQr: uuid,
            nombreServidor: user.nombre,
            hash: dto.hash,
            fecha: hoy,
        };
        const resp = this.estampar(datosE);
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
        if (doc.firmado == true) {
            const datosF = {
                path: pathPdf,
                rfc: user.rfc,
                docI: uuid,
                psw: dto.psw,
                firma_status: 1,
            };
            const datosFA = {
                path: (await acuse).path_acuse,
                rfc: user.rfc,
                docI: uuid,
                psw: dto.psw,
                firma_status: 0,
            };
            this.firmarDoc(datosF);
            this.firmarDoc(datosFA);
        }
        return this.detalle(doc.id);
    }
    async marcarVisto(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        if (!atencion.visto) {
            await this.atenciones.update(atencion.id, { visto: 1, fecha_visto: new Date() });
        }
        return { message: 'Oficio marcado como visto.' };
    }
    async atender(user, atencionId) {
        const atencion = await this.atencionPropia(user, atencionId);
        await this.atenciones.update(atencion.id, {
            status_atencion: 1,
            fecha_atencion: new Date(),
            visto: 1,
            fecha_visto: atencion.fecha_visto ?? new Date(),
        });
        return { message: 'El oficio se marcó como atendido.' };
    }
    async validarPsw(user, psw) {
        const datos = {
            'rfc': user.rfc,
            'password': psw
        };
        const feplemUrl = this.configService.get('feplem.baseUrl');
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.post(feplemUrl + '/api/validaCertificados', datos, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            const resp = {
                hash: String(response.data)
            };
            return resp;
        }
        catch (error) {
            return error.response?.data;
        }
    }
    async validarFirmado(user, id) {
        const registro = await this.registros.findOne({
            where: {
                id: id
            },
            relations: {
                destinatarios: true
            }
        });
        if (registro?.rfc_registro != user.rfc) {
            const destinatario = registro?.destinatarios?.find((d) => d.rfc_atencion === user.rfc);
            if (destinatario?.visto == 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    async resumen(user) {
        const [entradaPendientes, entradaSinVer, salidaTotal] = await Promise.all([
            this.atenciones.count({
                where: { rfc_atencion: user.rfc, status_atencion: 0, activo: 1 },
            }),
            this.atenciones.count({ where: { rfc_atencion: user.rfc, visto: 0, activo: 1 } }),
            this.registros.count({ where: { rfc_registro: user.rfc, activo: 1 } }),
        ]);
        return { entradaPendientes, entradaSinVer, salidaTotal };
    }
    async atencionPropia(user, atencionId) {
        const atencion = await this.atenciones.findOne({
            where: { id: atencionId, rfc_atencion: user.rfc },
        });
        if (!atencion) {
            throw new common_1.NotFoundException('El oficio no está dirigido a tu bandeja.');
        }
        return atencion;
    }
    async siguienteFolio() {
        const anio = new Date().getFullYear();
        const total = await this.registros
            .createQueryBuilder('doc')
            .where('YEAR(doc.created_at) = :anio', { anio })
            .getCount();
        return `${anio}-${String(total + 1).padStart(5, '0')}`;
    }
    async nombresPorRfc(rfcs) {
        const unicos = [...new Set(rfcs.filter(Boolean))];
        if (!unicos.length) {
            return new Map();
        }
        const servidores = await this.servidores.find({ where: { N_Usuario: (0, typeorm_2.In)(unicos) } });
        return new Map(servidores.map((s) => [s.N_Usuario, s.Nombre ?? 'Usuario no identificado']));
    }
    aplicarEstado(query, estado, campo) {
        if (estado === 'pendientes') {
            query.andWhere(`${campo} = 0`);
        }
        else if (estado === 'atendidos') {
            query.andWhere(`${campo} = 1`);
        }
    }
    aplicarFiltrosComunes(query, filtro, alias) {
        if (filtro.search) {
            query.andWhere(`(${alias}.folio LIKE :search OR ${alias}.titulo_doc LIKE :search)`, { search: `%${filtro.search}%` });
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
    async estampar(datosE) {
        const pathDoc = path.join(process.cwd(), 'storage', 'files', datosE.pathPdf);
        const pdfBytes = await fs_1.promises.readFile(pathDoc);
        const pdfOriginal = await pdf_lib_1.PDFDocument.load(pdfBytes);
        const pdfNuevo = await pdf_lib_1.PDFDocument.create();
        const paginas = await pdfNuevo.copyPages(pdfOriginal, pdfOriginal.getPageIndices());
        const feplemUrl = this.configService.get('feplem.baseUrl');
        const urlQr = feplemUrl + `/d/${datosE.nombreCarpeta},${datosE.uuid}`;
        const qrPng = await qrcode.toDataURL(urlQr, {
            width: 100,
            margin: 1,
        });
        const qrBase64 = qrPng.split(',')[1];
        const qrBytes = Buffer.from(qrBase64, 'base64');
        const qrImage = await pdfNuevo.embedPng(qrBytes);
        const font = await pdfNuevo.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const fontBold = await pdfNuevo.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        paginas.forEach((pagina, index) => {
            const page = pdfNuevo.addPage(pagina);
            const { width, height } = page.getSize();
            const qrX = width - 225;
            const qrY = height - 760;
            page.drawImage(qrImage, {
                x: qrX,
                y: qrY,
                width: 40,
                height: 40,
            });
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
            page.drawText(this.formatearFecha(datosE.fecha), {
                x: textX + 100,
                y: qrY + 35,
                size: 4,
                font,
            });
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
            page.drawText('Identificador único del documento:', {
                x: textX,
                y: qrY + 25,
                size: 4,
                font: fontBold,
            });
            page.drawText(datosE.uuid, {
                x: textX + 75,
                y: qrY + 25,
                size: 4,
                font,
            });
            const texto = 'Para verificar la integridad de este documento, ' +
                'favor de escanear el código QR o visitar el enlace ' +
                'https://feplem.gob.mx/validar-documento. ' +
                'Para mayor información ingrese a: ' +
                'https://feplem.gob.mx';
            this.drawTextWrapped(page, texto, {
                x: textX,
                y: qrY + 20,
                maxWidth: 160,
                size: 4,
                lineHeight: 5,
                font,
            });
            page.drawText(`Página: ${index + 1}/${paginas.length}`, {
                x: textX,
                y: qrY + 5,
                size: 4,
                font,
            });
        });
        const pdfFinal = await pdfNuevo.save();
        const directorio = path.dirname(datosE.pathPdf);
        const directorioN = path.join(process.cwd(), 'storage', 'files', directorio);
        await fs_1.promises.mkdir(directorioN, {
            recursive: true,
        });
        const nuevoPath = path.join(directorioN, `${datosE.uuid}.pdf`);
        await fs_1.promises.writeFile(nuevoPath, pdfFinal, { flag: 'w' });
        const resp = {
            qrImage: qrImage,
            nuevoPath: nuevoPath,
        };
        return resp;
    }
    formatearFecha(fecha) {
        const date = fecha instanceof Date
            ? fecha
            : new Date(fecha);
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}Z`;
    }
    drawTextWrapped(page, text, options) {
        const palabras = text.split(' ');
        let linea = '';
        let y = options.y;
        for (const palabra of palabras) {
            const prueba = linea.length > 0
                ? `${linea} ${palabra}`
                : palabra;
            const ancho = options.font.widthOfTextAtSize(prueba, options.size);
            if (ancho > options.maxWidth) {
                page.drawText(linea, {
                    x: options.x,
                    y,
                    size: options.size,
                    font: options.font,
                });
                linea = palabra;
                y -= options.lineHeight;
            }
            else {
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
    async firmarDoc(datosF) {
        const data = {
            path: datosF.path,
            user_rfc: datosF.rfc,
            contra: datosF.psw,
            docI: datosF.docI,
            tipo: 'documentacion/oficios',
            firma_status: datosF.firma_status,
            status_doc: '1',
            firma: 8,
            tipo_firmante: null,
            fecha_expedicion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
            fecha_certificacion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
        };
        const feplemUrl = this.configService.get('feplem.baseUrl');
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.post(feplemUrl + '/api/firmaDocumentos', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            return response.data;
            console.log('Respuesta firma:', response.data);
        }
        catch (error) {
            return console.error(error);
        }
    }
    async acuse(datos) {
        const uuidQr = (0, crypto_1.randomUUID)();
        const uuidA = (0, crypto_1.randomUUID)();
        const fondoPath = path.join(process.cwd(), 'storage', 'images', 'fondo_acuse.png');
        const directorio = path.join(process.cwd(), 'storage', 'files', 'documentacion', 'oficios', datos.carpeta);
        await fs_1.promises.mkdir(directorio, {
            recursive: true,
        });
        const nuevoPathAcuse = path.join(directorio, `${datos.uuid}_acuse.pdf`);
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]);
        const fontBold = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const fontNormal = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const fondoBytes = await fs_1.promises.readFile(fondoPath);
        const fondo = await pdfDoc.embedPng(fondoBytes);
        page.drawImage(fondo, {
            x: 0,
            y: 0,
            width: 612,
            height: 792,
        });
        page.drawText('Acuse de recibo', {
            x: 255,
            y: 792 - 165,
            size: 12,
            font: fontBold,
        });
        const feplemUrl = this.configService.get('feplem.baseUrl');
        const urlQr = feplemUrl + `/d/${datos.carpeta},${datos.uuid}`;
        const qrPng = await qrcode.toDataURL(urlQr, {
            width: 100,
            margin: 1,
        });
        const qrBase64 = qrPng.split(',')[1];
        const qrBytes = Buffer.from(qrBase64, 'base64');
        const qrImage = await pdfDoc.embedPng(qrBytes);
        page.drawImage(qrImage, {
            x: 319,
            y: 792 - 774,
            width: 55,
            height: 55,
        });
        page.drawText(datos.remitente ?? '', {
            x: 380,
            y: 792 - 734,
            size: 5,
            font: fontNormal,
        });
        page.drawText(datos.hoy ?? '', {
            x: 500,
            y: 792 - 734,
            size: 5,
            font: fontNormal,
        });
        page.drawText(datos.hash ?? '', {
            x: 380,
            y: 792 - 749,
            size: 5,
            font: fontNormal,
        });
        page.drawText(uuidA, {
            x: 380,
            y: 792 - 764,
            size: 5,
            font: fontNormal,
        });
        page.drawText(uuidA, {
            x: 380,
            y: 792 - 779,
            size: 5,
            font: fontNormal,
        });
        const pdfFinal = await pdfDoc.save();
        await fs_1.promises.writeFile(nuevoPathAcuse, pdfFinal, { flag: 'w' });
        const pathPdfAcu = `documentacion/oficios/${datos.carpeta}/${datos.uuid}_acuse.pdf`;
        return {
            path_acuse: pathPdfAcu,
            uuid_acuse: uuidA,
        };
    }
    async verPdf(id, tipo) {
        const registro = await this.registros.findOne({
            where: {
                id: id
            }
        });
        const pathDoc = tipo === 1
            ? registro?.path_doc
            : tipo === 2
                ? registro?.path_acuse
                : null;
        const ruta = path.join(process.cwd(), 'storage', 'files', pathDoc ?? '');
        return ruta;
    }
    async firmarDocAcuse(id, psw, user) {
        const registro = await this.registros.findOne({
            where: {
                id: id
            },
            relations: {
                destinatarios: true
            }
        });
        if (registro?.rfc_registro != user.rfc) {
            const destinatario = registro?.destinatarios?.find((d) => d.rfc_atencion === user.rfc);
            if (destinatario) {
                const at = destinatario.tipo_atencion.split(',');
                let firma;
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
                    };
                    firma = await this.firmarAcuse(datos);
                }
                const datos = {
                    path: registro?.path_doc,
                    user_rfc: user.rfc,
                    contra: psw,
                    docI: registro?.uuid_doc,
                    tipo: 'documentacion/oficios',
                    firma_status: '0',
                    status_doc: '1',
                    firma: 8,
                    tipo_firmante: null,
                    fecha_expedicion: new Date,
                    fecha_certificacion: new Date
                };
                firma = await this.firmarAcuse(datos);
                if (firma === 1) {
                    this.atenciones.update({ id: destinatario.id }, { visto: 1, fecha_visto: new Date() });
                    return 1;
                }
                else {
                    console.log('reteno de firma ', firma);
                    return firma;
                }
            }
        }
    }
    async firmarAcuse(datos) {
        const feplemUrl = this.configService.get('feplem.baseUrl');
        console.log('datos para firmar', datos);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.http.post(feplemUrl + '/api/firmaDocumentos', datos, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            return response.data;
        }
        catch (error) {
            return error.response?.data;
        }
    }
};
exports.OficiosService = OficiosService;
exports.OficiosService = OficiosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registro_doc_entity_1.RegistroDoc)),
    __param(1, (0, typeorm_1.InjectRepository)(atencion_doc_entity_1.AtencionDoc)),
    __param(2, (0, typeorm_1.InjectRepository)(servidor_publico_entity_1.ServidorPublico, configuration_1.SAF_CONNECTION)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], OficiosService);
//# sourceMappingURL=oficios.service.js.map