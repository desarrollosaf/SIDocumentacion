import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Equivalente a App\Models\TipoDocs (tabla tipo_docs).
 * El nombre vive en `tipo_doc` y `duracion` es el plazo de conservación.
 */
@Entity({ name: 'tipo_docs' })
export class TipoDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  tipo_doc: string | null;

  @Column({ type: 'int', nullable: true })
  duracion: number | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}

/** Equivalente a App\Models\TipoAtencions (tabla tipo_atencions). */
@Entity({ name: 'tipo_atencions' })
export class TipoAtencion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  tipo: string | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
