"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_2 = require("typeorm");
const configuration_1 = require("../config/configuration");
const role_entity_1 = require("../entities/doc/role.entity");
const servidor_publico_entity_1 = require("../entities/saf/servidor-publico.entity");
const user_entity_1 = require("../entities/saf/user.entity");
const MODEL_TYPE = 'App\\Models\\UsersSaf';
let AuthService = class AuthService {
    users;
    servidores;
    roles;
    modelHasRoles;
    jwt;
    config;
    constructor(users, servidores, roles, modelHasRoles, jwt, config) {
        this.users = users;
        this.servidores = servidores;
        this.roles = roles;
        this.modelHasRoles = modelHasRoles;
        this.jwt = jwt;
        this.config = config;
    }
    async login({ usuario, password }) {
        const user = await this.users
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.rfc = :usuario OR u.email = :usuario', { usuario })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario o contraseña incorrectos.');
        }
        if (user.bloqueo) {
            throw new common_1.UnauthorizedException('Tu cuenta está bloqueada por intentos fallidos. Contacta al administrador del sistema.');
        }
        const valido = await bcrypt.compare(password, user.password ?? '');
        if (!valido) {
            await this.registrarIntentoFallido(user);
            throw new common_1.UnauthorizedException('Usuario o contraseña incorrectos.');
        }
        if (user.intentos) {
            await this.users.update(user.id, { intentos: 0 });
        }
        const perfil = await this.perfilDe(user);
        const { id, ...resto } = perfil;
        return {
            access_token: await this.jwt.signAsync({ sub: id, ...resto }),
            user: perfil,
        };
    }
    async perfilDe(user) {
        const [servidor, roles] = await Promise.all([
            user.rfc
                ? this.servidores.findOne({
                    where: { N_Usuario: user.rfc },
                    relations: { dependencia: true, direccion: true, departamento: true },
                })
                : Promise.resolve(null),
            this.rolesDe(user.id),
        ]);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            rfc: user.rfc ?? '',
            roles,
            nombre: servidor?.Nombre ?? user.name ?? 'Usuario no identificado',
            dependencia: servidor?.dependencia?.nombre_completo ?? null,
            direccion: servidor?.direccion?.nombre_completo ?? null,
            departamento: servidor?.departamento?.nombre_completo ?? null,
            id_Dependencia: servidor?.id_Dependencia ?? null,
            id_Direccion: servidor?.id_Direccion ?? null,
            id_Departamento: servidor?.id_Departamento ?? null,
            c_presup: servidor?.departamento?.c_presup ?? null,
            path_foto: user.path_foto,
        };
    }
    async perfilPorId(id) {
        const user = await this.users.findOne({ where: { id } });
        if (!user) {
            throw new common_1.UnauthorizedException('La sesión ya no es válida.');
        }
        return this.perfilDe(user);
    }
    async cambiarPassword(userId, dto) {
        if (dto.nueva !== dto.confirmacion) {
            throw new common_1.BadRequestException('La confirmación no coincide con la nueva contraseña.');
        }
        const user = await this.users
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.id = :userId', { userId })
            .getOne();
        if (!user || !(await bcrypt.compare(dto.actual, user.password ?? ''))) {
            throw new common_1.BadRequestException('La contraseña actual no es correcta.');
        }
        const hash = await bcrypt.hash(dto.nueva, 12);
        await this.users.update(user.id, { password: hash.replace(/^\$2a\$/, '$2y$') });
        return { message: 'Tu contraseña se actualizó correctamente.' };
    }
    async penalizarIntentoFallido(userId) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user) {
            return { intentos: 0, bloqueado: false };
        }
        const intentos = (user.intentos ?? 0) + 1;
        const maximo = this.config.get('maxIntentosLogin', 3);
        const bloqueado = intentos >= maximo;
        await this.users.update(user.id, {
            intentos,
            bloqueo: bloqueado ? 1 : (user.bloqueo ?? 0),
        });
        return { intentos, bloqueado, maximo };
    }
    async reiniciarIntentos(userId) {
        await this.users.update(userId, { intentos: 0 });
    }
    async registrarIntentoFallido(user) {
        await this.penalizarIntentoFallido(user.id);
    }
    async rolesDe(userId) {
        const asignaciones = await this.modelHasRoles.find({
            where: { model_id: userId, model_type: MODEL_TYPE },
        });
        if (!asignaciones.length) {
            return [];
        }
        const roles = await this.roles.find({
            where: { id: (0, typeorm_2.In)(asignaciones.map((a) => a.role_id)) },
        });
        return roles.map((role) => role.name);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User, configuration_1.SAF_CONNECTION)),
    __param(1, (0, typeorm_1.InjectRepository)(servidor_publico_entity_1.ServidorPublico, configuration_1.SAF_CONNECTION)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(3, (0, typeorm_1.InjectRepository)(role_entity_1.ModelHasRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map