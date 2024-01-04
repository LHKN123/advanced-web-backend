import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { ObjectId } from 'mongodb';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async create(registerUser: RegisterUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerUser.email },
    });
    if (!existingUser) {
      const newUser = this.userRepository.create(registerUser);
      return this.userRepository.save(newUser);
    } else {
      throw new HttpException('Account already exists', HttpStatus.CONFLICT);
    }
  }

  async deleteUser(userId: string): Promise<any> {
    const objectId = new ObjectId(userId);
    const user = await this.userRepository.findOne({
      where: { _id: objectId },
    });

    if (!user) {
      throw new HttpException('User is not exist', HttpStatus.UNAUTHORIZED);
    }

    await this.userRepository.remove(user);
  }

  async updateProfile(id: string, username: string, student_id: string) {
    const objectId = new ObjectId(id);
    const updatedUser = await this.userRepository.findOne({
      where: { _id: objectId },
    });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // updatedUser.username = username;
    // updatedUser.email = email;
    // // await this.userRepository.update({ _id: objectId }, { email: email });
    // const newUser = await this.userRepository.update(
    //   { _id: objectId },
    //   { username: username },
    // );
    return this.userRepository.save({ ...updatedUser, username, student_id });
  }

  async updateProfilePassword(reqUser: ResetPasswordDto) {
    const currentUser = await this.userRepository.findOne({
      where: { email: reqUser.email },
    });
    if (!currentUser) {
      throw new HttpException('User not found', HttpStatus.CONFLICT);
    } else {
      currentUser.password = reqUser.password;
      this.userRepository.save({ ...currentUser });
      return HttpStatus.OK;
    }
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) },
    });
    return user;
  }

  async getAllUsers(): Promise<any> {
    const users = await this.userRepository.find();
    return users;
  }

  async updateUser(userId: string, reqBody: any): Promise<any> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.CONFLICT);
    }

    await this.userRepository.update(new ObjectId(userId), {
      ...user,
      username: reqBody.username,
      student_id: reqBody.studentId,
      role: reqBody.role
    });
  }
}
