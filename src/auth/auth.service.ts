import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async banUser(banUser: BanUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: banUser.email },
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user._id };
    const { access_token, refresh_token } = await this.generateToken(
      payload,
      user.email,
    );

    await this.userRepository.save(
      {
        ...user,
        email: banUser.email,
        status: banUser.status,
        refresh_token: refresh_token
      },
    );
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === "ban") {
      throw new HttpException(
        'This account is restricted',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user._id };
    const { access_token, refresh_token } = await this.generateToken(
      payload,
      user.email,
    );
    return {
      email: user.email,
      username: user.username,
      access_token,
      refresh_token,
      studentId: user.student_id,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status
    };
  }

  async loginAdmin(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }

    if (user.role !== 'admin') {
      throw new HttpException('User is not an admin', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === "ban") {
      throw new HttpException(
        'This account is restricted',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user._id };
    const { access_token, refresh_token } = await this.generateToken(
      payload,
      user.email,
    );
    return {
      email: user.email,
      username: user.username,
      access_token,
      refresh_token,
      studentId: user.student_id,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status
    };
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken({ id: verify.id }, verify.email);
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Resfresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async register(registerUser: RegisterUserDto) {
    if (!registerUser.password) {
      throw error;
    }

    const hashPassword = await this.hashPassword(registerUser.password);
    let response = await this.userService.create({
      ...registerUser,
      role: 'user',
      password: hashPassword,
    });
    if (response) {
      const { password, ...result } = response;
      return result;
    }
  }

  async registerAdmin(registerUser: RegisterUserDto) {
    if (!registerUser.password) {
      throw error;
    }

    const hashPassword = await this.hashPassword(registerUser.password);
    let response = await this.userService.create({
      ...registerUser,
      role: 'admin',
      password: hashPassword,
    });
    if (response) {
      const { password, ...result } = response;
      return result;
    }
  }


  decodeToken(token): any {
    return this.jwtService.decode(token);
  }

  sendEmail(reqBody: RecoveryPasswordDto): void {
    this.mailerService.sendMail({
      to: reqBody.email,
      subject: 'LightHub Verification Code',
      template: './reset-password',
      context: {
        email: reqBody.email,
        otp: reqBody.otp,
      },
    });
  }

  async sendRecoveryEmail(reqBody: RecoveryPasswordDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: reqBody.email },
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }

    // Use a dedicated service for handling emails (nodemailer)
    // Send email with the reset link
    this.sendEmail(reqBody);

    // Return an appropriate response
    return HttpStatus.OK;
  }

  sendVerifyAccountEmail(reqBody: RecoveryPasswordDto): void {
    this.mailerService.sendMail({
      to: reqBody.email,
      subject: 'LightHub Verification Code',
      template: './verify-account',
      context: {
        email: reqBody.email,
        otp: reqBody.otp,
      }
    })
  }

  async sendVerificationEmail(reqBody: RecoveryPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: reqBody.email },
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }

    // Use a dedicated service for handling emails (nodemailer)
    this.sendVerifyAccountEmail(reqBody)

    // Return an appropriate response
    return HttpStatus.OK;
  }

  async resetPassword(reqBody: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: reqBody.email },
    });
    // Generate a refresh token
    const payload = { id: user._id };
    await this.generateToken(payload, user.email);
    const hashPassword = await this.hashPassword(reqBody.password);
    reqBody.password = hashPassword;
    await this.userService.updateProfilePassword(reqBody);
  }

  async generateToken(payload: { id: ObjectId }, email) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });

    await this.userRepository.update(
      { email: email },
      { refresh_token: refresh_token },
    );

    return { access_token, refresh_token };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  // async registerUser(registerUser: RegisterUserDto) {
  //   if (!registerUser.password) {
  //     throw error;
  //   }

  //   const hashPassword = await this.hashPassword(registerUser.password);
  //   let response = await this.userService.create({
  //     ...registerUser,
  //     password: hashPassword,
  //   });
  //   if (response) {
  //     const { password, ...result } = response;
  //     return result;
  //   }
  // }

  async signInSocialLogin(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    let userExists = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!userExists) {
      user = await this.register({
        username: user.firstName.concat(' ').concat(user.lastName),
        password: 'DEFAULT PASSWORD',
        role: 'user',
        email: user.email,
        avatarUrl: user.picture ? user.picture : null
      });


    }

    const payload = { id: userExists ? userExists._id : user._id };
    const { access_token, refresh_token } = await this.generateToken(
      payload,
      user.email,
    );
    return {
      // email: user.email,
      // username: user.username ? user.username : userExists.username,
      access_token,
      refresh_token,
    };
  }

  getCookieRefreshToken(token: string) {
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'EXP_IN_REFRESH_TOKEN',
    )}`;
    return cookie;
  }

  async getUser(userId: string): Promise<any> {
    const objectId = new ObjectId(userId);
    const user = await this.userRepository.findOne({
      where: { _id: objectId },
    });


    const payload = { id: user._id };
    const { access_token, refresh_token } = await this.generateToken(
      payload,
      user.email,
    );
    return {
      email: user.email,
      username: user.username,
      status: user.status,
      role: user.role,
      access_token,
      refresh_token,
      studentId: user.student_id,
      avatarUrl: user.avatarUrl
    };
  }
}
