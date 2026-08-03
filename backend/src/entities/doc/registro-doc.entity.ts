import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AtencionDoc } from './atencion-doc.entity';

/**
 * Equivalente a App\Models\RegistroDocs (tabla registro_docs).
 * Es el oficio cargado y firmado electrónicamente que se envía a destinatarios.
 */
@Entity({ name: 'registro_docs' })
export class RegistroDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  folio: string | null;

  @Column({ type: 'int', nullable: true })
  fojas: number | null;

  @Column({ type: 'varchar', nullable: true })
  titulo_doc: string | null;

  @Column({ type: 'varchar', nullable: true })
  path_doc: string | null;

  @Column({ type: 'varchar', nullable: true })
  uuid_doc: string | null;

  @Column({ type: 'varchar', nullable: true })
  path_acuse: string | null;

  @Column({ type: 'varchar', nullable: true })
  uuid_acuse: string | null;

  @Column({ type: 'varchar', nullable: true })
  rfc_registro: string | null;

  @Column({ type: 'int', nullable: true })
  serie_id: number | null;

  @Column({ type: 'int', nullable: true })
  subserie_id: number | null;

  @Column({ type: 'int', nullable: true })
  expediente_id: number | null;

  @Column({ type: 'int', nullable: true })
  tipo_doc: number | null;

  @Column({ type: 'tinyint', nullable: true })
  firmado: number | null;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'tinyint', default: 1 })
  activo: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @OneToMany(() => AtencionDoc, (atencion) => atencion.registroDoc)
  destinatarios?: AtencionDoc[];
}
