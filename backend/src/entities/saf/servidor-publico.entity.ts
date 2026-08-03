import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dependencia } from './dependencia.entity';
import { Direccion } from './direccion.entity';
import { Departamento } from './departamento.entity';

/**
 * Equivalente a App\Models\ServidorPublico (conexión mysqlSaf, tabla s_usuario).
 * `N_Usuario` es el RFC del servidor público y es la llave que enlaza con users_safs.rfc.
 */
@Entity({ name: 's_usuario' })
export class ServidorPublico {
  @PrimaryGeneratedColumn({ name: 'id_Usuario' })
  id_Usuario: number;

  @Column({ name: 'N_Usuario', type: 'varchar' })
  N_Usuario: string;

  @Column({ type: 'varchar', nullable: true })
  Nombre: string | null;

  @Column({ name: 'id_Dependencia', type: 'int', nullable: true })
  id_Dependencia: number | null;

  @Column({ name: 'id_Direccion', type: 'int', nullable: true })
  id_Direccion: number | null;

  @Column({ name: 'id_Departamento', type: 'int', nullable: true })
  id_Departamento: number | null;

  @ManyToOne(() => Dependencia, { nullable: true })
  @JoinColumn({ name: 'id_Dependencia', referencedColumnName: 'id_Dependencia' })
  dependencia?: Dependencia | null;

  @ManyToOne(() => Direccion, { nullable: true })
  @JoinColumn({ name: 'id_Direccion', referencedColumnName: 'id_Direccion' })
  direccion?: Direccion | null;

  @ManyToOne(() => Departamento, { nullable: true })
  @JoinColumn({ name: 'id_Departamento', referencedColumnName: 'id_Departamento' })
  departamento?: Departamento | null;
}
