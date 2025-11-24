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
exports.Loan = void 0;
const typeorm_1 = require("typeorm");
const member_entity_1 = require("../../members/entities/member.entity");
const book_entity_1 = require("../../books/entities/book.entity");
const fine_entity_1 = require("../../fines/entities/fine.entity");
let Loan = class Loan {
    loan_id;
    member;
    book;
    borrow_date;
    due_date;
    return_date;
    fine;
    created_at;
    updated_at;
};
exports.Loan = Loan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'loan_id' }),
    __metadata("design:type", String)
], Loan.prototype, "loan_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => member_entity_1.Member, (member) => member.loans, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'member_id' }),
    __metadata("design:type", member_entity_1.Member)
], Loan.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.Book, (book) => book.loans, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'book_id' }),
    __metadata("design:type", book_entity_1.Book)
], Loan.prototype, "book", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Loan.prototype, "borrow_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Loan.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Loan.prototype, "return_date", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => fine_entity_1.Fine, (fine) => fine.loan),
    __metadata("design:type", fine_entity_1.Fine)
], Loan.prototype, "fine", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Loan.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Loan.prototype, "updated_at", void 0);
exports.Loan = Loan = __decorate([
    (0, typeorm_1.Entity)('loans')
], Loan);
//# sourceMappingURL=loan.entity.js.map