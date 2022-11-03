import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bark, BarkDocument } from 'src/bark/bark.schema';
import { UserUpdateDto } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
    @InjectModel('Bark') private readonly BarkModel: Model<BarkDocument>,
  ) {}

  // async getUserBarks(userId: string): Promise<BarkDocument[]> {
  //   try {
  //     //validate the userId
  //     const user = await this.UserModel.findOne({ _id: userId });
  //     if (!user) {
  //       throw new ForbiddenException('credentials invalid');
  //     }

  //     //get the barks
  //     const userBarks = await this.BarkModel.find({ userId, isComment: false });

  //     return userBarks;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //Get user by handle
  async getUserByHandle(
    handle: string,
  ): Promise<
    { userBarks: BarkDocument[]; user: UserDocument } | { msg: string }
  > {
    try {
      //find the user and check if user exists
      const user = await this.UserModel.findOne({ handle });
      delete user['password'];
      if (!user) {
        return { msg: 'user not found' };
      }

      //get the user barks that are not comments
      const userBarks = await this.BarkModel.find({
        userId: user._id,
        isComment: false,
      });

      userBarks.reverse();
      return {
        user,
        userBarks,
      };
    } catch (error) {
      throw error;
    }
  }

  //Get user by namse
  async getUserByName(name: string): Promise<UserDocument[]> {
    try {
      //find the user and check if user exists
      const user = await this.UserModel.find({ name });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // GET USER AND BARKS
  async getUserById(
    userId: string,
  ): Promise<
    { userBarks: BarkDocument[]; user: UserDocument } | { msg: string }
  > {
    try {
      //find the user and check if user exists
      const user = await this.UserModel.findOne({ _id: userId });
      delete user['password'];
      if (!user) {
        return { msg: 'user not found' };
      }

      //get the user barks that are not comments
      const userBarks = await this.BarkModel.find({ userId, isComment: false });

      userBarks.reverse();
      return {
        user,
        userBarks,
      };
    } catch (error) {
      throw error;
    }
  }

  //get usr followers
  async getUserFollowers(userId: string) {
    console.log(userId);
    return await this.UserModel.findOne({ _id: userId })
      .populate('followers')
      .select('followers');
  }

  //get user followees
  async getUserFollowees(userId: string) {
    return await this.UserModel.findOne({ _id: userId })
      .populate('following')
      .select('following');
  }

  //follow user
  //follower(the one sending the request) is following followeeId
  async followUser(followerId: string, followeeId: string) {
    try {
      //get the user(followeeId)
      const followee = await this.UserModel.findOne({ _id: followeeId });
      if (!followee) throw new NotFoundException('user not found');

      //get the user(followerId)
      const follower = await this.UserModel.findOne({ _id: followerId });
      if (!follower) throw new NotFoundException('user not found');

      //check if the follow relation is there
      let isFollow = followee.followers.find((element) => {
        const elementString = element.toString();
        return elementString == follower.id;
      });
      if (isFollow) {
        throw new NotFoundException('follow relation exist');
      }
      isFollow = follower.following.find((element) => {
        const elementString = element.toString();
        return elementString == followee.id;
      });
      if (isFollow) {
        throw new NotFoundException('follow relation exist');
      }

      //update and save the followee followers and increase the followerCount
      followee.followers.push(follower);
      followee.followersCount += 1;

      //update and save the follower following
      follower.following.push(followee);
      follower.followingCount += 1;

      //save the 2 users back to the database
      followee.save();
      follower.save();

      return { msg: 'followed' };
    } catch (error) {
      throw error;
    }
  }

  //unfollow user
  //unfollower is unfollowing unfollowee
  async unfollowUser(unfollowerId: string, unfolloweeId: string) {
    try {
      //get unfollower
      const unfollower = await this.UserModel.findOne({ _id: unfollowerId });
      if (!unfollower) throw new NotFoundException('user not found');

      //get unfollowee
      const unfollowee = await this.UserModel.findOne({ _id: unfolloweeId });
      if (!unfollowee) throw new NotFoundException('user not found');

      //check if the follow relation is there
      let isFollow = unfollowee.followers.find((element) => {
        const elementString = element.toString();
        return elementString == unfollower.id;
      });
      if (!isFollow) {
        throw new NotFoundException("follow1 relation doesn't exist");
      }

      isFollow = unfollower.following.find((element) => {
        const elementString = element.toString();
        return elementString == unfollowee.id;
      });

      if (!isFollow) {
        throw new NotFoundException("follow2 relation doesn't exist");
      }

      //remove unfollower from unfollowee followers and reduce the follower count
      unfollowee.followers = unfollowee.followers.filter((value) => {
        if (value.toString() == unfollower.id) {
          return false;
        }
        return true;
      });
      unfollowee.followersCount -= 1;

      //remove unfollowee from unfollower following
      unfollower.following = unfollower.following.filter((value) => {
        if (value.toString() == unfollowee.id) {
          return false;
        }
        return true;
      });
      unfollower.followingCount -= 1;

      //save them
      unfollowee.save();
      unfollower.save();

      return { msg: 'unfollowed' };
    } catch (error) {
      throw error;
    }
  }

  //update the user details
  async updateUserDetails(userUpdateDto: UserUpdateDto, userId: string) {
    try {
      //check if the handle is taken or not
      // const handleCheck = await this.UserModel.findOne({
      //   handle: userUpdateDto.handle,
      // });
      // if (handleCheck) {
      //   throw new UnauthorizedException('handle is already in use');
      // }

      //update the user if handle not in use
      const user = await this.UserModel.findOne({ _id: userId });

      user.name = userUpdateDto.name;
      user.handle = userUpdateDto.handle;
      user.bio = userUpdateDto.bio || '';

      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      if (error.code == 11000) {
        throw new BadRequestException('handle is use');
      }
      throw error;
    }
  }
}
