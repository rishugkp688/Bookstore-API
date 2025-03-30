import { IsOptional, IsNumber, IsDate, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedDate?: Date;
}