import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Authentication {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * name
   */
  public getAuthUser(email: string, password: string) {
    console.log('email: ', email, '\npassword: ', password);
    return {
      name: 'Sathwik',
      familyName: 'Shetty',
    };
  }

  getJwtToken(username: string, password: string, userId: number) {
    const payload = { name: username, sub: password, userId };

    return this.jwtService.sign(payload);
  }
}
