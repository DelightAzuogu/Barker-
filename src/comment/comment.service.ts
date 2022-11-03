import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bark, BarkDocument } from 'src/bark/bark.schema';
import { BarkDto } from 'src/bark/dto';
import { CommentDocument } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment')
    private readonly CommentModel: Model<CommentDocument>,
    @InjectModel('Bark') private readonly BarkModel: Model<BarkDocument>,
  ) {}

  //comment on bark
  async addComment(barkId: string, userId: string, barkDto: BarkDto) {
    try {
      //get the bark
      const bark = await this.BarkModel.findOne({ _id: barkId });
      if (!bark) {
        throw new NotFoundException('bark not found');
      }

      //create the comment bark
      const commentBark = await this.BarkModel.create({
        userId,
        text: barkDto.text,
        isComment: true,
      });

      //add the comment bark to the comment in the
      bark.comment.push(commentBark);

      //increase the bark comments count
      bark.commentCount += 1;
      await bark.save();

      //add the comment and bark relation in the comment schamea
      const comment = await this.CommentModel.create({
        bark,
        comment: commentBark,
      });

      return commentBark;
    } catch (error) {
      throw error;
    }
  }

  //get user comments
  async userComments(userId: string) {
    return await this.BarkModel.find({
      userId,
      isComment: true,
    });
  }

  //delete a comment bark
  async deleteComment(commentId: string) {
    try {
      //get comment bark
      const comment = await this.BarkModel.findOne({ _id: commentId });
      if (!comment) {
        throw new NotFoundException('comment not found');
      }

      //get the comment relation
      const commentRelation = await this.CommentModel.findOne({ comment });
      if (!commentRelation) {
        throw new NotFoundException('comment not found');
      }

      //get the actual bark
      const bark = await this.BarkModel.findOne({ _id: commentRelation.bark });
      if (!bark) {
        //deleting the comment and the commentRelation because there was a mixup
        comment.deleteOne();
        commentRelation.deleteOne();
        return { msg: 'deleted' };
      }

      //remove the comment from the bark
      bark.comment = bark.comment.filter((element) => {
        if (element.toString() == comment.id) return false;
        return true;
      });
      //check of the bark was changed
      if (bark.comment.length == bark.commentCount) {
        return { msg: 'comment not in bark' };
      }
      //reduce the comment count
      bark.commentCount -= 1;
      await bark.save();

      //delete the comment and comment Relation
      comment.deleteOne();
      commentRelation.deleteOne();

      return { msg: 'deleted' };
    } catch (error) {
      throw error;
    }
  }

  //delete comments when deleting a post
  async deleteComments(comments) {
    try {
      for (let comment of comments) {
        //get the comment relation
        const commentRelation = await this.CommentModel.findOne({ comment });
        if (!commentRelation) {
          continue;
        }

        //delete the comment relation
        commentRelation.deleteOne();

        //delete the comment from bark
        await this.BarkModel.deleteOne({ _id: commentRelation.comment });
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
