"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelHasRole = exports.Role = void 0;
const typeorm_1 = require("typeorm");
let Role = class Role {
    id;
    name;
    guard_name;
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'web' }),
    __metadata("design:type", String)
], Role.prototype, "guard_name", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)({ name: 'roles' })
], Role);
let ModelHasRole = class ModelHasRole {
    role_id;
    model_type;
    model_id;
};
exports.ModelHasRole = ModelHasRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'role_id' }),
    __metadata("design:type", Number)
], ModelHasRole.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model_type', type: 'varchar', primary: true }),
    __metadata("design:type", String)
], ModelHasRole.prototype, "model_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model_id', type: 'bigint', primary: true }),
    __metadata("design:type", Number)
], ModelHasRole.prototype, "model_id", void 0);
exports.ModelHasRole = ModelHasRole = __decorate([
    (0, typeorm_1.Entity)({ name: 'model_has_roles' })
], ModelHasRole);
//# sourceMappingURL=role.entity.js.map