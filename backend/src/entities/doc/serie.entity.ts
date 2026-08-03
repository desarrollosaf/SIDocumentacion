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
import { Seccion } from './seccion.entity';
import { SubSerie } from './sub-serie.entity';

/**
 * Equivalente a App\Models\Series (tabla series).
 * El nombre de la serie vive en la columna `serie`, no en `nombre`.
 */
@Entity({ name: 'series' })
export class Serie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', nullable: true })
  serie: string | null;

  @Column({ type: 'int', nullable: true })
  idSeccion: number | null;

  @Column({ type: 'int', nullable: true })
  departamento_id: number | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'int', nullable: true })
  anio_tramite: number | null;

  @Column({ type: 'int', nullable: true })
  anios_consentracion: number | null;

  @Column({ type: 'int', nullable: true })
  total_anios: number | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => Seccion, (seccion) => seccion.series, { nullable: true })
  @JoinColumn({ name: 'idSeccion' })
  seccion?: Seccion | null;

  @OneToMany(() => SubSerie, (sub) => sub.serie)
  subseries?: SubSerie[];
}
