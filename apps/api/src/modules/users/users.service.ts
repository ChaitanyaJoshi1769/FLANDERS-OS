import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(
    email: string,
    organizationId: string
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, organizationId },
    });
  }

  async findByEmailWithPassword(
    email: string,
    organizationId: string
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, organizationId },
      select: ['id', 'email', 'firstName', 'lastName', 'organizationId', 'passwordHash', 'mfaEnabled', 'status'],
    });
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { organizationId },
    });
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  async deactivate(id: string): Promise<User> {
    return this.update(id, { status: 'deactivated' });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
