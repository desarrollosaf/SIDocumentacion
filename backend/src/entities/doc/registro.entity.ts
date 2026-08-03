import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Serie } from './serie.entity';
import { RegistroAtencion } from './registro-atencion.entity';

/**
 * Estados de `status_envio`, según RegistroController@store:
 *  0 — capturado por una persona autorizada; espera autorización del titular.
 *  2 — espera visto bueno.
 *  4 — liberado; es el estado que aparece en las bandejas de entrada.
 */
export const ESTADO_ENVIO = {
  PREREGISTRO: 0,
  VOBO: 2,
  LIBERADO: 4,
} as const;

/**
 * Equivalente a App\Models\Registro (tabla registro).
 * Es la solicitud/documento que entra al sistema y se turna a uno o más
 * servidores públicos a través de `registro_atencions`.
 */
@Entity({ name: 'registro' })
export class Registro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  folio: string;

  @Column({ type: 'int', nullable: true })
  folio_rastreo: number | null;

  @Column({ type: 'date', nullable: true })
  fecha_recepcion: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_documento: string | null;

  @Column({ type: 'varchar', nullable: true })
  referencia_documento: string | null;

  @Column({ type: 'date' })
  fecha_limite_atencion: string;

  @Column({ type: 'time', nullable: true })
  hora_atencion: string | null;

  @Column({ type: 'int' })
  tipo_atencion: number;

  @Column({ type: 'int' })
  serie_id: number;

  @Column({ type: 'int', nullable: true })
  subserie_id: number | null;

  @Column({ type: 'int', nullable: true })
  expediente_id: number | null;

  @Column({ type: 'varchar' })
  titulo_doc: string;

  @Column({ type: 'longtext' })
  descripcion_doc: string;

  @Column({ type: 'longtext', nullable: true })
  path: string | null;

  @Column({ type: 'int' })
  user_registro: number;

  @Column({ type: 'varchar' })
  remitente_rfc: string;

  @Column({ type: 'varchar', nullable: true })
  otro_remitente: string | null;

  @Column({ type: 'varchar', nullable: true })
  nombre_remitente: string | null;

  @Column({ type: 'int', nullable: true })
  fojas: number | null;

  @Column({ type: 'varchar', nullable: true })
  uuid: string | null;

  @Column({ type: 'int', nullable: true })
  firmado: number | null;

  @Column({ type: 'int', nullable: true })
  tipo_doc: number | null;

  @Column({ type: 'tinyint', nullable: true, default: ESTADO_ENVIO.LIBERADO })
  status_envio: number | null;

  @Column({ type: 'varchar', nullable: true })
  rfc_autorizado: string | null;

  @Column({ type: 'varchar', nullable: true })
  rfc_vobo: string | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'tinyint', default: 1 })
  activo: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => Serie, { nullable: true })
  @JoinColumn({ name: 'serie_id' })
  serie?: Serie | null;

  @OneToMany(() => RegistroAtencion, (atencion) => atencion.registro)
  atenciones?: RegistroAtencion[];
}
