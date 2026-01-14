import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    return 'Hello Rohit';
  }

  getHelloName(name: string): string {
    return `Hi, Hello ${name}`;
  }
}
