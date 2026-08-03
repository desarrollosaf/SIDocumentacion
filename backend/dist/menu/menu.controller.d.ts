import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menu;
    constructor(menu: MenuService);
    menuDelUsuario(user: AuthenticatedUser): import("./menu.data").MenuItem[];
}
