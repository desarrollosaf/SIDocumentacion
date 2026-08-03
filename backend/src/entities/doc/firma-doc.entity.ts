import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Equivalente a App\Models\FirmaDocs (tabla firma_docs).
 * Documentos sueltos que el usuario sube exclusivamente para firmarlos, sin
 * turnarlos a nadie; alimenta la pantalla "Firma de documento".
 */
@Entity({ name: 'firma_docs' })
export class FirmaDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  path_doc: string | null;

  @Column({ type: 'varchar' })
  nombre_doc: string;

  @Column({ type: 'varchar' })
  uuid_doc: string;

  @Column({ type: 'varchar' })
  rfc_registro: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;
}
