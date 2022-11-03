import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../user/user.schema';

export type BarkDocument = Bark & Document;

@Schema()
export class Bark {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({
    required: true,
  })
  text: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  likes: User[];

  @Prop({
    required: true,
    default: 0,
  })
  likeCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  rebark: User[];

  @Prop({
    required: true,
    default: 0,
  })
  rebarkCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bark',
      },
    ],
  })
  comment: Bark[];

  @Prop({
    required: true,
    default: 0,
  })
  commentCount: number;

  @Prop({
    required: true,
    default: false,
  })
  isComment: boolean;
}

export const BarkSchema = SchemaFactory.createForClass(Bark);
