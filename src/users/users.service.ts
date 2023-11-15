import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

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

  async updateProfile(id: string, username: string, email: string) {
    const objectId = new ObjectId(id);
    console.log('objectId', objectId);
    const updatedUser = await this.userRepository.findOne({
      where: { _id: objectId },
    });
    console.log('UPDATE', updatedUser);
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
    console.log(updatedUser);
    return this.userRepository.save({ ...updatedUser, email, username });
  }
}
