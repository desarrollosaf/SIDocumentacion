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
import { DocTipoApoyo } from './docs-tipo-apoyo.entity';

/**
 * Equivalente a App\Models\Agenda (tabla agendas).
 * Cada solicitud genera un evento con su fecha límite de atención; el color
 * distingue el tipo de atención (amarillo = atención, naranja = conocimiento).
 */
@Entity({ name: 'tipo_doc_apoyos' })
export class TipoApoyo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  tipo: string | null;
  
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @OneToMany(() => DocTipoApoyo, (docsA) => docsA.tipoApoyo)
    docsApoyo?: DocTipoApoyo[];
}
