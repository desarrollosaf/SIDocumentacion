import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Equivalente a App\Models\Dependencias (mysqlSaf, tabla t_dependencia). */
@Entity({ name: 't_dependencia' })
export class Dependencia {
  @PrimaryGeneratedColumn({ name: 'id_Dependencia' })
  id_Dependencia: number;

  @Column({ type: 'varchar', nullable: true })
  nombre_completo: string | null;

  @Column({ type: 'varchar', nullable: true })
  Nombre: string | null;
}
