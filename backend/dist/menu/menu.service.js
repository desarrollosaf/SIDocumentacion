"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const menu_data_1 = require("./menu.data");
let MenuService = class MenuService {
    paraUsuario(user) {
        return this.filtrar(menu_data_1.MENU, user);
    }
    filtrar(items, user) {
        const visibles = [];
        for (const item of items) {
            if (!this.esVisible(item, user)) {
                continue;
            }
            if (item.submenu?.length) {
                const submenu = this.filtrar(item.submenu, user);
                if (!submenu.length) {
                    continue;
                }
                visibles.push({ ...item, submenu });
                continue;
            }
            visibles.push({ ...item });
        }
        return visibles.filter((item, i) => !item.navheader || visibles.slice(i + 1).some((next) => !next.navheader));
    }
    esVisible(item, user) {
        return !item.rfcs?.length || item.rfcs.includes(user.rfc);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)()
], MenuService);
//# sourceMappingURL=menu.service.js.map