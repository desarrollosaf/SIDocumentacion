import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServidorPublico } from './servidor-publico.entity';

/**
 * Equivalente a App\Models\User (conexión mysqlSaf, tabla users_safs).
 */
@Entity({ name: 'users_safs' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  rfc: string | null;

  @Column({ type: 'int', default: 0, nullable: true })
  intentos: number | null;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  bloqueo: number | null;

  @Column({ type: 'varchar', nullable: true })
  cel: string | null;

  @Column({ type: 'varchar', nullable: true })
  path_foto: string | null;

  @ManyToOne(() => ServidorPublico, { nullable: true })
  @JoinColumn({ name: 'rfc', referencedColumnName: 'N_Usuario' })
  servidorPublico?: ServidorPublico | null;
}
