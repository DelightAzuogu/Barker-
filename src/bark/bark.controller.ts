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
import { get } from 'http';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BarkService } from './bark.service';
import { BarkDto } from './dto';

@Controller('bark')
export class BarkController {
  constructor(private readonly barkservice: BarkService) {}

  //comment on bark
  @UseGuards(JwtGuard)
  @Post('comment/:barkId')
  async commentBark(
    @Param('barkId') barkId: string,
    @Body() barkDto: BarkDto,
    @GetUser('id') userId: string,
  ) {
    return this.barkservice.addComment(barkId, barkDto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete('/comment/:commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.barkservice.deleteComment(commentId);
  }

  //get user rebarks
  @Get('rebarks/:userId')
  async getUserRebarks(@Param('userId') userId: string) {
    return this.barkservice.UserRebarks(userId);
  }

  //rebark a post
  @UseGuards(JwtGuard)
  @Post('rebark/:barkId')
  async rebarkBark(
    @Param('barkId') barkId: string,
    @GetUser('id') userId: string,
  ) {
    return this.barkservice.rebarkABark(barkId, userId);
  }

  @UseGuards(JwtGuard)
  @Delete('rebark/:barkId')
  async deleteRebark(
    @Param('barkId') barkId: string,
    @GetUser('id') userId: string,
  ) {
    return this.barkservice.deleteRebark(barkId, userId);
  }

  //get post by id
  @Get('/:barkId')
  async getBarkById(@Param('barkId') barkId: string) {
    return this.barkservice.getBarkById(barkId);
  }

  //get user barks
  @Get()
  async getUserBark(@Query('userId') userId: string) {
    return this.barkservice.getUserBarks(userId);
  }

  //like/unlike bark
  @UseGuards(JwtGuard)
  @Post('like/:barkId')
  async likeUnlikeBark(
    @Param('barkId') barkId: string,
    @GetUser('id') userId: string,
  ) {
    return this.barkservice.likeUnlikeBark(barkId, userId);
  }

  //delete bark
  @UseGuards(JwtGuard)
  @Delete()
  async deleteBark(@Query('barkId') barkId: string) {
    return this.barkservice.deleteBark(barkId);
  }

  //post a bark
  @UseGuards(JwtGuard)
  @Post()
  async addBark(@Body() barkDto: BarkDto, @GetUser('id') userId: string) {
    return this.barkservice.addBark(barkDto, userId);
  }
}
