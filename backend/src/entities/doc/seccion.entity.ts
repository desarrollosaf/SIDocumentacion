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
import { Subfondo } from './subfondo.entity';
import { Serie } from './serie.entity';

/**
 * Equivalente a App\Models\Secciones (tabla secciones).
 * El nombre de la sección vive en la columna `seccion`, no en `nombre`.
 */
@Entity({ name: 'secciones' })
export class Seccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', nullable: true })
  seccion: string | null;

  @Column({ type: 'int', nullable: true })
  departamento_id: number | null;

  @Column({ type: 'int', nullable: true })
  direccion_id: number | null;

  @Column({ type: 'int', nullable: true })
  id_subfondo: number | null;

  @Column({ type: 'int', nullable: true })
  id_tipo_seccion: number | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => Subfondo, { nullable: true })
  @JoinColumn({ name: 'id_subfondo' })
  subfondo?: Subfondo | null;

  @OneToMany(() => Serie, (serie) => serie.seccion)
  series?: Serie[];
}
