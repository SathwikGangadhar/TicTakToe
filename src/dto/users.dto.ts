import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'Username must be a valid string',
  })
  username: string;

  @IsString({
    message: 'Password must be a valid string',
  })
  password: string;

  @IsString({
    message: 'bio must be a valid string',
  })
  bio: string;

  @IsString({
    message: 'profile_picture_url must be a valid string',
  })
  profilePictureUrl: string;
}

export class LoginUserDto {
  @IsString({
    message: 'Username must be a valid string',
  })
  username: string;

  @IsString({
    message: 'Password must be a valid string',
  })
  password: string;
}

export class LoginUserResponseDto {
  username: string;
  password: string;
  accessToken: string;
}
