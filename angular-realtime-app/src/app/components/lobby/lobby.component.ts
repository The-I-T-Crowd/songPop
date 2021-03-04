import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NodeService } from 'src/app/services/node-service';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { User } from '../model';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  
  @Select(AppState.getAdmin) admin$: Observable<string>;
  @Select(AppState.getUser) user$: Observable<User>;

  public admin: string;
  public user: User;
  
  private sub = new Subject();

  constructor(
    private nodeService: NodeService,
    private socketioService: SocketioService,
  ) {
    this.nodeService.getAdmin();
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.sub)).subscribe(user => {
      this.user = user;
    });

    this.admin$.pipe(takeUntil(this.sub)).subscribe(admin => {
      this.admin = admin;
    });
  }

  requestAdmin() {
    if (this.user) {
      this.socketioService.setAdmin(this.user);
    } else {
      this.socketioService.disconnectProcedure();
    }
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }
}