import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './components/model';
import { SocketioService } from './services/socketio.service';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from './state/app-state';
import { Select } from '@ngxs/store';
import { Clear } from './state/app.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @Select(AppState.getUser) userChange$: Observable<User>;

  public connectedUsers = [];
  public user: User;

  private sub = new Subject();

  constructor(
    private socketIoService: SocketioService,
    private store: Store,
    private route: Router,
  ) {
    this.store.dispatch(new Clear(null));
  }

  public ngOnInit(): void {
    this.userChange$.pipe(takeUntil(this.sub)).subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  private handleDisconnect() {
    this.route.navigate(['']);
    this.user = null;
  }

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
    this.socketIoService.disconnect();
  }
  
  public createUser(user: User) {
    this.user = user;
    this.connect(user);
  }

  public sendName(userName: string): void {
    this.socketIoService.sendName(userName);
  }

  private connect(user: User): void {
    this.socketIoService.connect(user);
  }
}
