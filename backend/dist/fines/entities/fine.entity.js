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
exports.Fine = void 0;
const typeorm_1 = require("typeorm");
const loan_entity_1 = require("../../loans/entities/loan.entity");
let Fine = class Fine {
    fine_id;
    loan;
    late_days;
    amount;
    is_paid;
    fine_date;
    paid_at;
    created_at;
    updated_at;
};
exports.Fine = Fine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'fine_id' }),
    __metadata("design:type", String)
], Fine.prototype, "fine_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => loan_entity_1.Loan, (loan) => loan.fine, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'loan_id' }),
    __metadata("design:type", loan_entity_1.Loan)
], Fine.prototype, "loan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Fine.prototype, "late_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Fine.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Fine.prototype, "is_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Fine.prototype, "fine_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Fine.prototype, "paid_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Fine.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Fine.prototype, "updated_at", void 0);
exports.Fine = Fine = __decorate([
    (0, typeorm_1.Entity)('fines')
], Fine);
//# sourceMappingURL=fine.entity.js.map