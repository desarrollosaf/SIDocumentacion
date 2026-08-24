import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Equivalente a App\Models\Agenda (tabla agendas).
 * Cada solicitud genera un evento con su fecha límite de atención; el color
 * distingue el tipo de atención (amarillo = atención, naranja = conocimiento).
 */
@Entity({ name: 'expediente_serie_subses' })
export class Expedientes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  id_serie: number | null;

  @Column({ type: 'int', nullable: true })
  id_subserie: number | null;

  @Column({ type: 'text', nullable: true })
  nombre_ex: string | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number | null;

  @Column({ type: 'date', nullable: true })
  fecha_cierre_exp: Date | null;

  @Column({ type: 'int', nullable: true })
  anio: number | null;

  @Column({ type: 'int', nullable: true })
  id_tipo_expediente: number | null;

  @Column({ type: 'text', nullable: true })
  rfc_usuario_expediente: string | null;

  @Column({ type: 'int', nullable: true })
  id_solicitud_transferencia: number | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
