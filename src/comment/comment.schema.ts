import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Bark } from 'src/bark/bark.schema';
import { User } from '../user/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ require: true, type: mongoose.Schema.Types.ObjectId })
  comment: Bark;

  @Prop({ require: true, type: mongoose.Schema.Types.ObjectId })
  bark: Bark;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
