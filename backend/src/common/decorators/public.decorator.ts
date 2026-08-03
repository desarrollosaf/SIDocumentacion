import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marca un endpoint como accesible sin JWT (equivalente al middleware `guest`). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
