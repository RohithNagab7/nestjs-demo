import { HelloService } from './hello.service';
import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [HelloService],
  exports: [HelloService],
})
export class HelloModule {}
