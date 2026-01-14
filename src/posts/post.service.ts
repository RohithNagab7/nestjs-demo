import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ILike, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdateClassDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAllPosts(title?: string): Promise<Post[]> {
    if (!title) {
      return this.postRepository.find();
    }

    const searchedPost = await this.postRepository.find({
      where: {
        title: ILike(`%${title}%`),
      },
    });

    if (searchedPost.length === 0) {
      throw new NotFoundException(`Post with title: ${title}, not found`);
    }
    return searchedPost;
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with Id: ${id}, not found`);
    }

    return post;
  }

  async createPost(createdPostBody: CreatePostDto): Promise<Post> {
    const newPostBody = this.postRepository.create({
      title: createdPostBody.title,
      content: createdPostBody.content,
      authorName: createdPostBody.authorName,
    });

    return this.postRepository.save(newPostBody);
  }

  async updatePost(id: number, updatedPostBody: UpdateClassDto): Promise<Post> {
    const currentPostBody = await this.postRepository.findOne({
      where: { id },
    });

    if (!currentPostBody) {
      throw new NotFoundException(`Post with Id: ${id}, not found`);
    }

    Object.assign(currentPostBody, updatedPostBody);
    return this.postRepository.save(currentPostBody);
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} not found`);
    }

    await this.postRepository.remove(post);
  }
}
