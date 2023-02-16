import { Injectable, NotFoundException, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';

export enum BoardEvents {
  Call = 'call',
}

export class CallEvent {
  constructor(public calledPassword: number) {}
}

export class Board {
  public readonly events = new EventEmitter2();
  public current = 0;
  constructor(public readonly name: string) {}
}

@Injectable()
export class BoardService {
  private boards = new Map<string, Board>([]);

  list(): Array<Board & { id: string }> {
    return Array.from(this.boards).map(([id, board]) => ({ ...board, id }));
  }

  add(name: string) {
    this.boards.set(randomUUID(), new Board(name));
  }

  get(id: string) {
    return this.boards.get(id);
  }

  listen(id: string): Observable<MessageEvent> {
    const b = this.boards.get(id);

    if (!b) throw new NotFoundException();

    return fromEvent(b.events, BoardEvents.Call).pipe(
      map((e: CallEvent) => ({
        data: e,
        type: BoardEvents.Call,
      })),
    );
  }

  call(id: string): void {
    const b = this.boards.get(id);

    if (!b) throw new NotFoundException();

    b.current++;

    b.events.emit(BoardEvents.Call, new CallEvent(b.current));
  }
}
