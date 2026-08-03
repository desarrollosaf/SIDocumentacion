import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { MenuItem } from './menu.data';
export declare class MenuService {
    paraUsuario(user: AuthenticatedUser): MenuItem[];
    private filtrar;
    private esVisible;
}
