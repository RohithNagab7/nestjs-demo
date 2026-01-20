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
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UpdateClassDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostExistCheckPipe } from './pipes/post-exist.pipe';
import type { Post as PostTypes } from './entities/post.entity';
import { FetchPostThrottler } from './guards/fetchpost-throttler.guard';
import { CreatePostThrottler } from './guards/createpost-throttler.guard';
import { FindPostQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/global/interface/paginated-response.interface';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(FetchPostThrottler)
  @Get()
  async getAllPosts(
    @Query() query: FindPostQueryDto,
  ): Promise<PaginatedResponse<PostTypes>> {
    return this.postService.getAllPosts(query);
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe, PostExistCheckPipe) id: number,
  ): Promise<PostTypes> {
    return this.postService.getPostById(id);
  }

  @UseGuards(CreatePostThrottler)
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
