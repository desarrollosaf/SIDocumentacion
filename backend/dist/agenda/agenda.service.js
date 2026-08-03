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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agenda_entity_1 = require("../entities/doc/agenda.entity");
let AgendaService = class AgendaService {
    agendas;
    constructor(agendas) {
        this.agendas = agendas;
    }
    async eventos(desde, hasta) {
        const query = this.agendas.createQueryBuilder('a').where('a.status = 1');
        if (desde && hasta) {
            query.andWhere('a.start BETWEEN :desde AND :hasta', {
                desde: `${desde} 00:00:00`,
                hasta: `${hasta} 23:59:59`,
            });
        }
        const eventos = await query.orderBy('a.start', 'ASC').getMany();
        return eventos.map((evento) => ({
            id: evento.id,
            registro_id: evento.registro_id,
            title: evento.title,
            descripcion: evento.descripcion,
            start: evento.start,
            end: evento.end,
            color: evento.color,
        }));
    }
    async detalle(id) {
        const evento = await this.agendas.findOne({ where: { id, status: 1 } });
        if (!evento) {
            throw new common_1.NotFoundException('El evento no existe.');
        }
        return evento;
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agenda_entity_1.Agenda)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map