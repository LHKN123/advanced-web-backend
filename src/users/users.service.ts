import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';

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

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(email: string, password: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      const newUser = this.userRepository.create({ email, password });
      return this.userRepository.save(newUser);
    } else {
      throw new HttpException('Account already exists', HttpStatus.CONFLICT);
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id });
  }

  async updateProfile(id: number, username: string, email: string) {
    return null;
  }
}
