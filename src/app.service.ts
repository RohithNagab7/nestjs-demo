import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configModule: ConfigService) {}
  getHello(): string {
    const appName = this.configModule.get<string>('appName');
    console.log('App Name: ', appName);
    return `the new app name is: ${appName}`;
  }
}
