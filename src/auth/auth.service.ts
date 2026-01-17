import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registeredUser: RegisterDto) {
    const isExistingUser = await this.userRepository.findOne({
      where: { email: registeredUser.email },
    });

    if (isExistingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(registeredUser.password);
    const newlyCreatedUser = this.userRepository.create({
      email: registeredUser.email,
      name: registeredUser.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(newlyCreatedUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userResut } = savedUser;

    return {
      user: userResut,
      message: 'User registered successfully',
    };
  }
  async registerAdmin(registeredAdmin: RegisterDto) {
    const isExistingUser = await this.userRepository.findOne({
      where: { email: registeredAdmin.email },
    });

    if (isExistingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(registeredAdmin.password);
    const newlyCreatedUser = this.userRepository.create({
      email: registeredAdmin.email,
      name: registeredAdmin.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const savedUser = await this.userRepository.save(newlyCreatedUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userResult } = savedUser;

    return {
      user: userResult,
      message: 'User registered successfully',
    };
  }

  async loginUser(loggedInUser: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loggedInUser.email },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const passwordCheck = await this.checkPassword(
      loggedInUser.password,
      user.password,
    );

    if (!passwordCheck) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT || 10,
    );
    return hashedPassword;
  }

  private async checkPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const passwordCheck = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordCheck;
  }

  private generateTokens(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const jwtaccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN,
      expiresIn: '15m',
    });

    return jwtaccessToken;
  }

  private generateRefreshToken(user: User) {
    const payload = {
      sub: user.id,
    };

    const jwtRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_TOKEN,
      expiresIn: '7d',
    });

    return jwtRefreshToken;
  }
}
