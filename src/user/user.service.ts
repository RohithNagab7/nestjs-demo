import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
  constructor(private readonly helloService: HelloService) {}

  getAllUsers() {
    return [
      { id: 1, name: 'Rohit', age: 23 },
      { id: 2, name: 'Nag', age: 26 },
      { id: 3, name: 'Nani', age: 20 },
      { id: 4, name: 'SpiderMan', age: 25 },
      { id: 5, name: 'SuperMan', age: 33 },
    ];
  }

  getUserById(id: number) {
    const user = this.getAllUsers().find((user) => user.id === id);
    return user;
  }

  getUserWelcome(id: number): string {
    const user = this.getUserById(id);
    if (!user) {
      return 'No User Found';
    }

    return this.helloService.getHelloName(user?.name);
  }
}
