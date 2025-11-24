// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepo: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const book = this.booksRepo.create({
      ...dto,
      is_available: true,
    });
    return this.booksRepo.save(book);
  }

  async findAll(query: QueryBookDto) {
    const { page = 1, limit = 10, search, genre, isAvailable } = query;

    const where: FindOptionsWhere<Book> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    if (genre) {
      where.genre = ILike(`%${genre}%`);
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

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepo.findOne({ where: { book_id: id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.booksRepo.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepo.remove(book);
  }

  async markAvailable(id: string, available: boolean) {
    const book = await this.findOne(id);
    book.is_available = available;
    return this.booksRepo.save(book);
  }
}
