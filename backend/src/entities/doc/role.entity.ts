import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Tabla `roles` de spatie/laravel-permission. */
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', default: 'web' })
  guard_name: string;
}

/**
 * Tabla pivote `model_has_roles` de spatie/laravel-permission.
 * `model_id` apunta a users_safs.id aunque viva en otra base de datos,
 * por eso la relación se resuelve manualmente en AuthService.
 */
@Entity({ name: 'model_has_roles' })
export class ModelHasRole {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  role_id: number;

  @Column({ name: 'model_type', type: 'varchar', primary: true })
  model_type: string;

  @Column({ name: 'model_id', type: 'bigint', primary: true })
  model_id: number;
}
