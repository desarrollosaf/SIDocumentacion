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
@Entity({ name: 'agendas' })
export class Agenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  registro_id: number | null;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'datetime', nullable: true })
  start: Date | null;

  @Column({ type: 'datetime', nullable: true })
  end: Date | null;

  @Column({ type: 'date', nullable: true })
  empieza: string | null;

  @Column({ type: 'date', nullable: true })
  termina: string | null;

  @Column({ type: 'time', nullable: true })
  hora: string | null;

  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
