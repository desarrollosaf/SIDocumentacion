import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restringe un endpoint a los roles indicados, equivalente al middleware
 * `role:` de spatie/laravel-permission.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
