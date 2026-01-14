import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is requirted.' })
  @IsString({ message: 'Title should contain alphabets' })
  @MinLength(3, { message: 'Title should be atleast 3 characters' })
  @MaxLength(50, { message: 'Title should not be above 50 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is requirted.' })
  @IsString({ message: 'Content should contain alphabets' })
  @MinLength(3, { message: 'Content should be atleast 3 characters' })
  content: string;

  @IsNotEmpty({ message: 'Author is requirted.' })
  @IsString({ message: 'Author should contain alphabets' })
  @MinLength(2, { message: 'Author should be atleast 2 characters' })
  @MaxLength(30, { message: 'Author should not be above 30 characters' })
  authorName: string;
}
