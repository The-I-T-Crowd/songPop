import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { io, Socket } from 'socket.io-client';
import { User } from '../components/model';
import { Store } from '@ngxs/store';
import { Clear, Connect, ConnectedUsers, Disconnect, SetAdmin, SetAllCategories, SetEventStopRound, SetLetterInPlay } from '../state/app.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NodeService } from './node-service';
import { ISubmittedAnswers } from '../components/game/game.component';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  
  private socket: Socket;
  private user: User;

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private route: Router,
    private nodeService: NodeService,
  ) {}

  public connect(user: User) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.user = user;
    this.subscribeToSocketEvents();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public getSocket(): Socket {
    return this.socket;
  }

  subscribeToSocketEvents(): void {
    this.socket.on('connect', () => {
      this.sendName(this.user.name);
      this.nodeService.getUsersConnected();
    });

    this.socket.on('disconnect', () => {
      this.store.dispatch(new Disconnect(null));
      this.store.dispatch(new Clear(null));
      this.route.navigate(['']);
    });

    this.socket.on('confirm-name', () => {
      this.store.dispatch(new Connect(this.socket.id));
    });

    this.socket.on('users-changed', (users: string[]) => {
      this.store.dispatch(new ConnectedUsers(users));
    });

    // ADMIN 
    this.socket.on('admin-changed', (admin: string) => {
      this.store.dispatch(new SetAdmin(admin));
      this.openSnackBar('Admin changed to: ' + admin);
    });

    this.socket.on('invald', (error: string) => {
      this.openSnackBar(error);
    });
    // ADMIN END

    // GAME
    this.socket.on('categories-ready', (catergories: string[]) => {
      console.log('categories-ready', catergories);
      this.store.dispatch(new SetAllCategories(catergories));
      this.route.navigate(['game'])
    });

    this.socket.on('stop-get-answers', () => {
      console.log('stop-get-answers');
      this.store.dispatch(new SetEventStopRound(true));
      this.store.dispatch(new SetEventStopRound(null));
    });


    // GAME END
    
    this.socket.on('force-disconnect', (message: string) => {
      this.openSnackBar(message);
      this.disconnectProcedure();
    });
  }

  sendName(userName: string) {
    this.socket.emit('send-name', { userName });
  }

  setAdmin(user: User) {
    this.socket.emit('set-admin', { userName: user.name });
  }

  setCategories(categories: string[]) {
    this.socket.emit('set-categories', { categories });
  }

  startGame() {
    this.socket.emit('start-game');
  }

  startRound() {
    this.socket.emit('start-round');
  }

  endRound(answers: {}[], letterInPlay: string) {
    this.socket.emit('end-round', { answers: this.getParsedAnswers(answers), letterInPlay });
  }

  private getParsedAnswers(answers): ISubmittedAnswers[] {
    const parsedAnswers: ISubmittedAnswers[] = [];
    const catergories = Object.keys(answers); // will be array of equal length
    const answerList = Object.values(answers) as string[];
    for( let i = 0; i < catergories.length; i++) {
      parsedAnswers.push({
        catergoryName: catergories[i],
        answer: answerList[i],
        score: 0,
      })
    }

    return parsedAnswers;
  }

  sendResults(answers, letterInPlay: string) {
    this.socket.emit('send-results', { answers: this.getParsedAnswers(answers), letterInPlay });
  }

  public disconnectProcedure() {
    this.socket.disconnect();      
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}