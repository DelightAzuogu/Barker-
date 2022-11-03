import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarkSchema } from 'src/bark/bark.schema';
import { CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
      },
      {
        name: 'Bark',
        schema: BarkSchema,
      },
    ]),
  ],
  exports: [CommentService],
})
export class CommentModule {}
