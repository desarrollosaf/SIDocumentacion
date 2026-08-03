import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Serie } from './serie.entity';

/**
 * Equivalente a App\Models\SubSeries (tabla sub_series).
 * El nombre vive en `subserie` y el área en `id_Departamento` (no
 * `departamento_id`, como sí ocurre en `series` y `secciones`).
 */
@Entity({ name: 'sub_series' })
export class SubSerie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', nullable: true })
  subserie: string | null;

  @Column({ type: 'int', nullable: true })
  idSerie: number | null;

  @Column({ name: 'id_Departamento', type: 'int', nullable: true })
  id_Departamento: number | null;

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

  @ManyToOne(() => Serie, (serie) => serie.subseries, { nullable: true })
  @JoinColumn({ name: 'idSerie' })
  serie?: Serie | null;
}
