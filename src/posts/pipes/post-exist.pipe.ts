import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PostService } from '../post.service';

@Injectable()
export class PostExistCheckPipe implements PipeTransform<
  number,
  Promise<number>
> {
  constructor(private readonly postService: PostService) {}

  async transform(value: number): Promise<number> {
    const post = await this.postService.getPostById(value);

    if (!post) {
      throw new NotFoundException(`Post with Id: ${value} not found`);
    }

    return value;
  }
}
