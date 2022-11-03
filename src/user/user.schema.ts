import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Bark } from '../bark/bark.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  bio: string;

  @Prop({
    required: true,
    unique: true,
  })
  handle: string;

  @Prop({
    required: true,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  followers: User[];

  @Prop({
    required: true,
    default: 0,
  })
  followersCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  following: User[];

  @Prop({
    required: true,
    default: 0,
  })
  followingCount: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bark',
      },
    ],
  })
  bark: Bark[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// name
// email
// password;
// bio
// handle;
// isVerified;
// follower;
// followerCount;
// following;
// followingCount;
