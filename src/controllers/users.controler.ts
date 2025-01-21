import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/dto/users.dto';
import { UsersService } from 'src/services/usersService';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() loginDTO: LoginUserDto) {
    return this.userService.login(loginDTO);
  }
}
