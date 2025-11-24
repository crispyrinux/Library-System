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
exports.FinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fine_entity_1 = require("./entities/fine.entity");
let FinesService = class FinesService {
    finesRepo;
    constructor(finesRepo) {
        this.finesRepo = finesRepo;
    }
    async createForLoan(loan, lateDays, amount) {
        const fine = this.finesRepo.create({
            loan,
            late_days: lateDays,
            amount,
            is_paid: false,
            fine_date: new Date().toISOString().substring(0, 10),
        });
        return this.finesRepo.save(fine);
    }
    async findAll(query) {
        const { page = 1, limit = 10, isPaid } = query;
        const qb = this.finesRepo
            .createQueryBuilder('fine')
            .leftJoinAndSelect('fine.loan', 'loan')
            .leftJoinAndSelect('loan.member', 'member')
            .leftJoinAndSelect('loan.book', 'book')
            .orderBy('fine.fine_date', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (isPaid !== undefined) {
            qb.andWhere('fine.is_paid = :paid', { paid: isPaid === 'true' });
        }
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const fine = await this.finesRepo.findOne({
            where: { fine_id: id },
            relations: ['loan', 'loan.member', 'loan.book'],
        });
        if (!fine)
            throw new common_1.NotFoundException('Fine not found');
        return fine;
    }
    async updateStatus(id, dto) {
        const fine = await this.findOne(id);
        if (dto.is_paid !== undefined) {
            fine.is_paid = dto.is_paid;
            fine.paid_at = dto.is_paid ? new Date() : null;
        }
        return this.finesRepo.save(fine);
    }
};
exports.FinesService = FinesService;
exports.FinesService = FinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fine_entity_1.Fine)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FinesService);
//# sourceMappingURL=fines.service.js.map