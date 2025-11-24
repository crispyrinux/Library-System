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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
let BooksService = class BooksService {
    booksRepo;
    constructor(booksRepo) {
        this.booksRepo = booksRepo;
    }
    async create(dto) {
        const book = this.booksRepo.create({
            ...dto,
            is_available: true,
        });
        return this.booksRepo.save(book);
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, genre, isAvailable } = query;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (genre) {
            where.genre = (0, typeorm_2.ILike)(`%${genre}%`);
        }
        if (isAvailable !== undefined) {
            where.is_available = isAvailable === 'true';
        }
        const [data, total] = await this.booksRepo.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { title: 'ASC' },
        });
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const book = await this.booksRepo.findOne({ where: { book_id: id } });
        if (!book)
            throw new common_1.NotFoundException('Book not found');
        return book;
    }
    async update(id, dto) {
        const book = await this.findOne(id);
        Object.assign(book, dto);
        return this.booksRepo.save(book);
    }
    async remove(id) {
        const book = await this.findOne(id);
        await this.booksRepo.remove(book);
    }
    async markAvailable(id, available) {
        const book = await this.findOne(id);
        book.is_available = available;
        return this.booksRepo.save(book);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BooksService);
//# sourceMappingURL=books.service.js.map