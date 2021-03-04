import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { User } from '../model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Select(AppState.getConnect) connect$: Observable<string>;
  @Select(AppState.getDisconnect) disconnect$: Observable<null>;

  @Input() user: User;

  public isConnected: boolean;
  
  private sub = new Subject();
  
  constructor(
    private route: Router,
    private socketioService: SocketioService) { }

  ngOnInit(): void {

    this.connect$.pipe(takeUntil(this.sub)).subscribe(sockeetId => {
      if (sockeetId) {
        this.isConnected = true;
      }
    });

    this.disconnect$.pipe(takeUntil(this.sub)).subscribe(() => {
      this.isConnected = false;
      this.route.navigate(['']);
    });
  }

  public leave() {
    this.socketioService.disconnectProcedure();
    this.isConnected = false;
    this.route.navigate(['']);
  }

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

}
