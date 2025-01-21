import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entites/user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  LoginUserResponseDto,
} from 'src/dto/users.dto';
import { UserProfile } from 'src/entites/user-profile.entity';
import { Authentication } from './authentication.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly authenticationService: Authentication,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }

    // Create and save the new user
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    const userProfile = new UserProfile();
    userProfile.bio = createUserDto.bio;
    userProfile.profile_picture_url = createUserDto.profilePictureUrl;
    user.profiles = [userProfile];

    return this.usersRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const { username, password } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.password !== password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const loginUserResponse: LoginUserResponseDto = new LoginUserResponseDto();
    loginUserResponse.username = username;
    loginUserResponse.password = password;
    loginUserResponse.accessToken = this.authenticationService.getJwtToken(
      username,
      password,
      user.id,
    );

    return loginUserResponse;
  }
}
