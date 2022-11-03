import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { UserSchema } from 'src/user/user.schema';
import { BarkController } from './bark.controller';
import { BarkSchema } from './bark.schema';
import { BarkService } from './bark.service';

@Module({
  controllers: [BarkController],
  providers: [BarkService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Bark',
        schema: BarkSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    CommentModule,
  ],
})
export class BarkModule {}
