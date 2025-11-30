import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Real Estate Platform API - Welcome!';
  }
}
