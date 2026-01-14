import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UpdateClassDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostExistCheckPipe } from './pipes/post-exist.pipe';
import type { Post as PostTypes } from './entities/post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(@Query('title') title?: string): Promise<PostTypes[]> {
    return this.postService.getAllPosts(title);
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe, PostExistCheckPipe) id: number,
  ): Promise<PostTypes> {
    return this.postService.getPostById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() createdPostBody: CreatePostDto): Promise<PostTypes> {
    return this.postService.createPost(createdPostBody);
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe, PostExistCheckPipe) id: number,
    @Body() updatePostBody: UpdateClassDto,
  ): Promise<PostTypes> {
    return this.postService.updatePost(id, updatePostBody);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', ParseIntPipe, PostExistCheckPipe) id: number,
  ): Promise<void> {
    return this.postService.deletePost(id);
  }
}
