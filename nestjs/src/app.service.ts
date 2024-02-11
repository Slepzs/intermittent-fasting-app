import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Suck my dick';
  }

  getFuckYeah(): string {
    return 'FUCK YEAH';
  }
}
