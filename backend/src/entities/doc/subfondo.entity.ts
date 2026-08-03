import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Equivalente a App\Models\Subfondo (tabla subfondo).
 * Esta tabla no lleva columna `status`: todos los subfondos están vigentes.
 */
@Entity({ name: 'subfondo' })
export class Subfondo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_Dependencia', type: 'int', nullable: true })
  id_Dependencia: number | null;

  @Column({ type: 'varchar', nullable: true })
  codigo: string | null;

  @Column({ type: 'varchar', nullable: true })
  subfondo: string | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
