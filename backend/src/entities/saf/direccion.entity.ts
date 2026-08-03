import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Equivalente a App\Models\Direccion (mysqlSaf, tabla t_direccion). */
@Entity({ name: 't_direccion' })
export class Direccion {
  @PrimaryGeneratedColumn({ name: 'id_Direccion' })
  id_Direccion: number;

  @Column({ name: 'id_Dependencia', type: 'int', nullable: true })
  id_Dependencia: number | null;

  @Column({ type: 'varchar', nullable: true })
  nombre_completo: string | null;

  @Column({ type: 'varchar', nullable: true })
  Nombre: string | null;
}
