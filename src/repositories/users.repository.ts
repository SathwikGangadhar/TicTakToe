// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Injectable } from '@nestjs/common';
// import { User } from 'src/entites/user.entity';

// @Injectable()
// export class UsersRepository {
//   constructor(
//     @InjectRepository(User)
//     private readonly usersRepository: Repository<User>,
//   ) {
//     console.log('Users repository');
//   }

//   async findAll(): Promise<User[]> {
//     const users = await this.usersRepository.find();

//     return users;
//   }

// }
