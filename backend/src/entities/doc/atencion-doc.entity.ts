import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegistroDoc } from './registro-doc.entity';

/**
 * Equivalente a App\Models\AtencionDocs (tabla atencion_docs).
 * Cada fila es un destinatario del oficio: alimenta la bandeja de entrada
 * (`rfc_atencion` = RFC del usuario en sesión).
 */
@Entity({ name: 'atencion_docs' })
export class AtencionDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  id_registro_doc: number;

  @Column({ type: 'varchar' })
  rfc_atencion: string;

  @Column({ type: 'tinyint', default: 0 })
  visto: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_visto: Date | null;

  /** 0 pendiente · 1 atendido */
  @Column({ type: 'tinyint', default: 0 })
  status_atencion: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_atencion: Date | null;

  /**
   * Papel del destinatario en el flujo de firma del oficio:
   * `E` elaboró · `R` revisó · `A` autorizó.
   */
  @Column({ type: 'varchar' })
  tipo_atencion: string;

  @Column({ type: 'varchar', nullable: true })
  rfc_turna: string | null;

  @Column({ type: 'tinyint', default: 1 })
  activo: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => RegistroDoc, (doc) => doc.destinatarios, { nullable: true })
  @JoinColumn({ name: 'id_registro_doc' })
  registroDoc?: RegistroDoc | null;
}
