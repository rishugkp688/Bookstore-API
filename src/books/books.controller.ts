import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Request() req) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() filterBooksDto: FilterBooksDto) {
    return this.booksService.findAll(filterBooksDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateBookDto: UpdateBookDto,
    @Request() req
  ) {
    return this.booksService.update(id, updateBookDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.booksService.remove(id, req.user.userId);
    return { message: 'Book successfully deleted' };
  }
}