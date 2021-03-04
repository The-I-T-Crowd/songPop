
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { User } from '../model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {

  @Select(AppState.getAdmin) admin$: Observable<string>;
  @Select(AppState.getUser) user$: Observable<User>;

  public admin: string;
  public user: User;

  public waitingForGameToStart: boolean;
  public waitingForRoundToStart: boolean;
  public roundInProgress: boolean;

  private sub = new Subject();

  constructor(
    private socketIoService: SocketioService,
  ) {
    this.waitingForGameToStart = true;
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.sub)).subscribe(user => {
      this.user = user;
    });
    this.admin$.pipe(takeUntil(this.sub)).subscribe(admin => {
      this.admin = admin;
    });
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
  }
  // 

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

  public startGame() {
    this.socketIoService.startGame();
  }

  public startRound() {
    this.socketIoService.startRound();
  }

  public isAdmin(): boolean {
    return this.admin && this.user.name === this.admin;
  }
}

export interface ISubmittedAnswers {
  catergoryName: string,
  answer: string,
  score: number,
}