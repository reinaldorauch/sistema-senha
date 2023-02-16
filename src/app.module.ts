import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BoardService } from './board.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [BoardService],
})
export class AppModule {}
