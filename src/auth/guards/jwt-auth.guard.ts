import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// this guard will protects the routes that need authentication => proteced routes

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
