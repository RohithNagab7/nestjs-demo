import { Inject, Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ILike, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdateClassDto } from './dto/update-post.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FindPostQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/global/interface/paginated-response.interface';

@Injectable()
export class PostService {
  private postListCacheKeys: Set<string> = new Set();
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostListCacheKeys(query: FindPostQueryDto): string {
    const { page = 1, limit = 10, title } = query;
    return `posts_lists_page${page}_limit${limit}_title${title || 'all'} `;
  }

  async getAllPosts(query: FindPostQueryDto): Promise<PaginatedResponse<Post>> {
    const cacheKey = this.generatePostListCacheKeys(query);

    this.postListCacheKeys.add(cacheKey);
    const getCachedData =
      await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);

    if (getCachedData) {
      console.log(`Cache Hit ---> returning posts from the cache ${cacheKey}`);
      return getCachedData;
    }
    console.log(`Cache Miss ---> returning posts form the DB`);

    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE: title', { title: `%${title}%` });
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    const responeResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page > 1,
        hasPreviousPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cacheKey, responeResult, 30000);
    return responeResult;
  }

  async getPostById(id: number): Promise<Post> {
    const cacheKey = `post_${id}`;
    const cachePost = await this.cacheManager.get<Post>(cacheKey);

    if (cachePost) {
      console.log(`Cache hit ---> returning from the cache ${cacheKey}`);
    }

    console.log(`Cache Miss ---> returning from the DB`);

    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with Id: ${id}, not found`);
    }

    await this.cacheManager.set(cacheKey, post, 30000);

    return post;
  }

  async createPost(createdPostBody: CreatePostDto): Promise<Post> {
    const newPostBody = this.postRepository.create({
      title: createdPostBody.title,
      content: createdPostBody.content,
      authorName: createdPostBody.authorName,
    });

    await this.invalidateExistingCache();

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

    const updatedPost = await this.postRepository.save(currentPostBody);

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateExistingCache();

    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} not found`);
    }

    await this.postRepository.remove(post);

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateExistingCache();
  }

  private async invalidateExistingCache(): Promise<void> {
    console.log(
      `Invalidating ${this.postListCacheKeys.size} list cache entries`,
    );

    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key);
    }

    this.cacheManager.clear();
  }
}
