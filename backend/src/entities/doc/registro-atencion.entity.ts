import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Registro } from './registro.entity';

/**
 * Equivalente a App\Models\RegistroAtencion (tabla registro_atencions).
 * Representa el turno de una solicitud hacia un servidor público (`user_rfc`),
 * turnado por otro (`user_turna`).
 *
 * Ojo: esta tabla usa camelCase en varias columnas (`statusAtencion`,
 * `tipoAtencion`, `fechaCierre`) y marca la baja lógica con `activo`, a
 * diferencia de las tablas de oficios.
 */
@Entity({ name: 'registro_atencions' })
export class RegistroAtencion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  registro_id: number | null;

  @Column({ type: 'varchar' })
  user_rfc: string;

  @Column({ type: 'varchar', nullable: true })
  user_turna: string | null;

  @Column({ type: 'longtext', nullable: true })
  indicaciones_turno: string | null;

  @Column({ type: 'tinyint', default: 0 })
  visto: number;

  /** 0 pendiente · 1 atendido */
  @Column({ type: 'tinyint', default: 0 })
  statusAtencion: number;

  /** Fecha en que se cerró el turno. */
  @Column({ type: 'date', nullable: true })
  fechaCierre: string | null;

  /** Tipo de atención del turno (catálogo tipo_atencions). */
  @Column({ type: 'varchar' })
  tipoAtencion: string;

  @Column({ type: 'tinyint', default: 1 })
  activo: number;

  @Column({ type: 'tinyint', default: 1 })
  notificacion: number;

  @Column({ type: 'int', nullable: true })
  id_atencion: number | null;

  @Column({ type: 'int', nullable: true })
  serie_id: number | null;

  @Column({ type: 'int', nullable: true })
  subserie_id: number | null;

  @Column({ type: 'int', nullable: true })
  expediente_id: number | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => Registro, (registro) => registro.atenciones, { nullable: true })
  @JoinColumn({ name: 'registro_id' })
  registro?: Registro | null;
}
