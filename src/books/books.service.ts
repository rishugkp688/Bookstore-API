import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto, userId: string): Promise<Book> {
    const newBook = new this.bookModel({
      ...createBookDto,
      createdBy: userId,
    });
    return newBook.save();
  }

  async findAll(filterBooksDto: FilterBooksDto): Promise<Book[]> {
    const query = this.buildQuery(filterBooksDto);
    return this.bookModel.find(query).exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto, userId: string): Promise<Book> {
    // First find the book to check ownership
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Check if the user is the book's creator
    if (book.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update books that you created');
    }

    // If authorized, proceed with update
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();

    return updatedBook;
  }

  async remove(id: string, userId: string): Promise<void> {
    // First find the book to check ownership
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Check if the user is the book's creator
    if (book.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete books that you created');
    }

    // If authorized, proceed with deletion
    await this.bookModel.findByIdAndDelete(id).exec();
  }

  private buildQuery(filterDto: FilterBooksDto): any {
    const { title, author, category, rating } = filterDto;
    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (author) {
      query.author = author;
    }

    if (category) {
      query.category = category;
    }

    if (rating !== undefined) {
      query.rating = rating;
    }

    return query;
  }
}