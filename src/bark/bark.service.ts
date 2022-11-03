import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { UserDocument } from 'src/user/user.schema';
import { BarkDocument } from './bark.schema';
import { BarkDto } from './dto';

@Injectable()
export class BarkService {
  constructor(
    @InjectModel('Bark') private readonly BarkModel: Model<BarkDocument>,
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
    private readonly commentService: CommentService,
  ) {}

  //get user
  async getUser(userId: string) {
    try {
      const user = await this.UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  //get bark by id
  async getBarkById(barkId: string) {
    return await this.BarkModel.findOne({ _id: barkId });
  }

  //get userBarks
  async getUserBarks(userId: string) {
    return await this.BarkModel.find({ userId, isComment: false });
  }

  //like bark
  async likeUnlikeBark(barkId: string, userId: string) {
    try {
      //get the user
      const user = await this.UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      //get the bark
      const bark = await this.BarkModel.findOne({ _id: barkId });
      if (!bark) {
        throw new NotFoundException('bark not found');
      }

      //check if user if in likes of barks
      const isLike = bark.likes.find(
        (element) => element.toString() == user.id,
      );
      if (isLike) {
        //write logic for unliking the bark
        bark.likes = bark.likes.filter((element) => {
          if (element.toString() == user.id) {
            return false;
          }
          return true;
        });
        bark.likeCount -= 1;
        bark.save();
        return { msg: 'unliked' };
      } else {
        //liking the bark
        bark.likes.push(user);
        bark.likeCount += 1;
        bark.save();

        return { msg: 'liked' };
      }
    } catch (error) {
      throw error;
    }
  }

  //comment bark
  async addComment(barkId: string, barkDto: BarkDto, userId: string) {
    return await this.commentService.addComment(barkId, userId, barkDto);
  }

  //get user comments
  async getUserComment(userId: string) {
    return await this.commentService.userComments(userId);
  }

  //delete a comment
  async deleteComment(commentId: string) {
    return await this.commentService.deleteComment(commentId);
  }

  //delete bark
  async deleteBark(barkId: string) {
    try {
      //get the bark
      const bark = await this.BarkModel.findOne({ _id: barkId });
      if (!bark) {
        throw new NotFoundException('bark not found');
      }

      if (bark.commentCount > 0) {
        //implementation for when the bark has comments
        await this.commentService.deleteComments(bark.comment);
      }
      //delete the bark
      bark.deleteOne();
      return { msg: 'deleted' };
    } catch (error) {
      throw error;
    }
  }

  //post a bark
  async addBark(barkDto: BarkDto, userId: string): Promise<BarkDocument> {
    try {
      //create the bark
      const bark = await this.BarkModel.create({
        userId,
        text: barkDto.text,
      });

      return bark;
    } catch (error) {
      throw error;
    }
  }

  //rebark a Post
  async rebarkABark(barkId: string, userId: string) {
    try {
      //get the bark
      const bark = await this.BarkModel.findOne({ _id: barkId });
      if (!bark) {
        throw new NotFoundException('bark not found');
      }

      //get the user
      const user = await this.UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      if (user.id == bark.userId.toString()) {
        throw new ForbiddenException('user can not rebark his bark');
      }

      //add user ti the rebarks
      bark.rebark.push(user);
      bark.rebarkCount += 1;
      bark.save();

      return { msg: 'rebarked', bark };
    } catch (error) {
      throw error;
    }
  }

  //get user rebarks
  async UserRebarks(userId: string) {
    try {
      //get the user
      const user = await this.UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      const rebarks = await this.BarkModel.find({ rebarks: userId });

      return rebarks;
    } catch (error) {
      throw error;
    }
  }

  //delete a rebark
  async deleteRebark(barkId: string, userId: string) {
    try {
      //get the user
      const user = await this.getUser(userId);

      //fine the bark
      const bark = await this.BarkModel.findOne({ _id: barkId });
      if (!bark) {
        throw new NotFoundException('bark not found');
      }

      //filter out the user from the rebarks
      bark.rebark = bark.rebark.filter((element) => {
        if (element.toString() == user.id) {
          console.log('inside');
          return false;
        }
        return true;
      });

      //check for length of rebark to see if user was removed
      if (bark.rebarkCount == bark.rebark.length) {
        return { msg: 'user not in rebark' };
      }

      bark.rebarkCount -= 1;
      await bark.save();

      return { msg: 'rebark deleted' };
    } catch (error) {
      throw error;
    }
  }
}
