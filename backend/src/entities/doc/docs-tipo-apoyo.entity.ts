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
import { TipoApoyo } from './tipo-apoyo.entity';

/**
 * Equivalente a App\Models\Agenda (tabla agendas).
 * Cada solicitud genera un evento con su fecha límite de atención; el color
 * distingue el tipo de atención (amarillo = atención, naranja = conocimiento).
 */
@Entity({ name: 'documentos_apoyos' })
export class DocTipoApoyo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  tipo_apoyo_id: number | null;

  @Column({ type: 'varchar', nullable: true })
  tipo: string | null;
  
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => TipoApoyo,(tipoApoyo) => tipoApoyo.docsApoyo)
  @JoinColumn({ name: 'tipo_apoyo_id' })
    tipoApoyo: TipoApoyo;
  
}
