import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Post as PostModel } from '../prisma/prisma-client/default';
import { PostService } from './page.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postService: PostService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Example code */
  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorId: number },
  ): Promise<PostModel> {
    const { title, content, authorId } = postData;
    return this.postService.createPost({
      title,
      content,
      authorId,
    });
  }
}
