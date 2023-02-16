import {
  Controller,
  Get,
  Post,
  Render,
  Sse,
  Body,
  MessageEvent,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller()
export class AppController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @Render('index')
  index() {
    return { boards: this.boardService.list() };
  }

  @Post('/board')
  createBoard(@Body(new ValidationPipe()) board: CreateBoardDto) {
    this.boardService.add(board.name);
  }

  @Get('/board/:id')
  @Render('board')
  board(@Param('id', new ParseUUIDPipe()) id: string) {
    const board = this.boardService.get(id);
    if (!board) {
      throw new NotFoundException();
    }
    return { board: { ...board, id } };
  }

  @Sse('/board/:id/events')
  boardEvents(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Observable<MessageEvent> {
    return this.boardService.listen(id);
  }

  @Post('/board/:id/call')
  callBoard(@Param('id', new ParseUUIDPipe()) id: string) {
    this.boardService.call(id);
  }
}
