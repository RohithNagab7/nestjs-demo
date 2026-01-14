import { Module } from '@nestjs/common';
import { HelloModule } from 'src/hello/hello.module';
import { UserContoller } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HelloModule],
  controllers: [UserContoller],
  providers: [UserService],
})
export class UserModule {}
