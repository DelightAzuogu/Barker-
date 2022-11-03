import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { UserDto } from 'src/user/dto';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectModel('User') private readonly UserModel: Model<User>,
    private readonly config: ConfigService,
  ) {}

  async signup(userDto: UserDto) {
    // generate the password hash
    const hashPw = await argon.hash(userDto.password);

    try {
      console.log(userDto);
      //create the new user
      const user = await this.UserModel.create({
        name: userDto.name,
        email: userDto.email,
        handle: userDto.handle,
        password: hashPw,
        bio: userDto.bio || '',
      });

      return { token: await this.signToken(user.id, user.email), user };
    } catch (error) {
      if (error.code == 11000) {
        if (error.keyPattern.email) {
          throw new BadRequestException('email exist already');
        }
        if (error.keyPattern.handle) {
          throw new BadRequestException('handle already exists');
        }
      }
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    // find the user by email
    const user = await this.UserModel.findOne({ email: authDto.email });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, authDto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return { token: await this.signToken(user.id, user.email), user };
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: secret,
    });

    return token;
  }
}
