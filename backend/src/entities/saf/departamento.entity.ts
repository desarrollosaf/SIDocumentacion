import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Equivalente a App\Models\Departamentos (mysqlSaf, tabla t_departamento). */
@Entity({ name: 't_departamento' })
export class Departamento {
  @PrimaryGeneratedColumn({ name: 'id_Departamento' })
  id_Departamento: number;

  @Column({ name: 'id_Dependencia', type: 'int', nullable: true })
  id_Dependencia: number | null;

  @Column({ name: 'id_Direccion', type: 'int', nullable: true })
  id_Direccion: number | null;

  @Column({ type: 'varchar', nullable: true })
  nombre_completo: string | null;

  @Column({ type: 'varchar', nullable: true })
  Nombre: string | null;

  /**
   * Clave presupuestal del área. Es el nombre de la carpeta donde se guardan
   * los documentos: `documentacion/oficios/{c_presup}/{uuid}.pdf`.
   */
  @Column({ type: 'varchar', nullable: true })
  c_presup: string | null;
}
