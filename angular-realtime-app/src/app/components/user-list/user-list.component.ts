import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/state/app-state';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  @Select(AppState.getConnectedUser) connectedUsers$: Observable<string[]>;
  @Select(AppState.getAdmin) admin$: Observable<string>;

  public connectedUsers = [];
  public admin = null;

  private sub = new Subject();

  constructor() { }

  ngOnInit(): void {
    this.connectedUsers$.pipe(takeUntil(this.sub)).subscribe(users => {
      this.connectedUsers = users;
    });

    this.admin$.pipe(takeUntil(this.sub)).subscribe(admin => {
      this.admin = admin;
    });
  }

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

}
