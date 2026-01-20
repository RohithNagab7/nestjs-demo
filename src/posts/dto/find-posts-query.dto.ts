import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/global/dto/pagination.dto';

export class FindPostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'Title must contain alphabets' })
  @MaxLength(100, { message: 'Title cannot exceed 100 charcters' })
  title?: string;
}
