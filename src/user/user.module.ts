import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarkSchema } from 'src/bark/bark.schema';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Bark',
        schema: BarkSchema,
      },
    ]),
  ],
})
export class UserModule {}
