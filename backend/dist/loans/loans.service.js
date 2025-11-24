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
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("./entities/loan.entity");
const books_service_1 = require("../books/books.service");
const members_service_1 = require("../members/members.service");
const fines_service_1 = require("../fines/fines.service");
let LoansService = class LoansService {
    loansRepo;
    booksService;
    membersService;
    finesService;
    LOAN_DAYS = 14;
    DAILY_FINE = 3000;
    constructor(loansRepo, booksService, membersService, finesService) {
        this.loansRepo = loansRepo;
        this.booksService = booksService;
        this.membersService = membersService;
        this.finesService = finesService;
    }
    async create(dto) {
        const book = await this.booksService.findOne(dto.book_id);
        const member = await this.membersService.findOne(dto.member_id);
        if (!book.is_available) {
            throw new common_1.BadRequestException('Book is not available');
        }
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + this.LOAN_DAYS);
        const loan = this.loansRepo.create({
            book,
            member,
            borrow_date: today.toISOString().substring(0, 10),
            due_date: dueDate.toISOString().substring(0, 10),
            return_date: null,
        });
        const saved = await this.loansRepo.save(loan);
        await this.booksService.markAvailable(book.book_id, false);
        return saved;
    }
    async findAll(query) {
        const { page = 1, limit = 10, member_id, activeOnly } = query;
        const qb = this.loansRepo
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.member', 'member')
            .leftJoinAndSelect('loan.book', 'book')
            .leftJoinAndSelect('loan.fine', 'fine')
            .orderBy('loan.borrow_date', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (member_id) {
            qb.andWhere('member.member_id = :member_id', { member_id });
        }
        if (activeOnly === 'true') {
            qb.andWhere('loan.return_date IS NULL');
        }
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const loan = await this.loansRepo.findOne({
            where: { loan_id: id },
            relations: ['member', 'book', 'fine'],
        });
        if (!loan)
            throw new common_1.NotFoundException('Loan not found');
        return loan;
    }
    async returnLoan(id, dto) {
        const loan = await this.findOne(id);
        if (loan.return_date) {
            throw new common_1.BadRequestException('Loan already returned');
        }
        const today = dto.return_date
            ? new Date(dto.return_date)
            : new Date();
        loan.return_date = today.toISOString().substring(0, 10);
        const due = new Date(loan.due_date);
        const lateMs = today.getTime() - due.getTime();
        const lateDays = Math.max(0, Math.ceil(lateMs / (1000 * 60 * 60 * 24)));
        const updatedLoan = await this.loansRepo.save(loan);
        await this.booksService.markAvailable(loan.book.book_id, true);
        if (lateDays > 0) {
            const amount = lateDays * this.DAILY_FINE;
            await this.finesService.createForLoan(updatedLoan, lateDays, amount);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const loan = await this.findOne(id);
        await this.loansRepo.remove(loan);
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        books_service_1.BooksService,
        members_service_1.MembersService,
        fines_service_1.FinesService])
], LoansService);
//# sourceMappingURL=loans.service.js.map