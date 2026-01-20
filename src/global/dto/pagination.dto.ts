import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a number' })
  @Min(1, { message: 'Page must be a number' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a number' })
  @Min(1, { message: 'limit must be a number' })
  @Max(100, { message: 'limit cannot exceed 100' })
  limit?: number = 10;
}
