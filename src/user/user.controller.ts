import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('bark')
  // async getUserBark(@Query() query: { userId: string }) {
  //   return this.userService.getUserBarks(query.userId);
  // }

  //get user by handle
  @Get('/@:handle')
  async getUserByHandle(@Param('handle') handle: string) {
    return this.userService.getUserByHandle(handle);
  }

  //get user followers
  @Get('/followers')
  async getUserFollowers(@Query('userId') userId: string) {
    console.log('delight');
    return await this.userService.getUserFollowers(userId);
  }

  //get user followees
  @Get('/followees')
  async getUserFollowees(@Query() query: { userId: string }) {
    return await this.userService.getUserFollowees(query.userId);
  }

  //get user by name
  @Get('/:name')
  async getUserByName(@Param('name') name: string) {
    return this.userService.getUserByName(name);
  }
  //get user by Id
  @Get()
  async getUserById(@Query('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  //follower user
  @Patch('/follow')
  @UseGuards(JwtGuard)
  async followUser(
    @Query() query: { followeeId: string },
    @GetUser('id') userId: string,
  ) {
    console.log(userId);
    return this.userService.followUser(userId, query.followeeId);
  }

  //unfollow user
  @Delete('/unfollow')
  @UseGuards(JwtGuard)
  async unfollowUser(
    @Query('unfolloweeId') unfolloweeId: string,
    @GetUser('id') userId: string,
  ) {
    return this.userService.unfollowUser(userId, unfolloweeId);
  }

  //update user details
  @Patch()
  @UseGuards(JwtGuard)
  async updateUserDetails(
    @Body() userUpdateDto: UserUpdateDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateUserDetails(userUpdateDto, userId);
  }
}
