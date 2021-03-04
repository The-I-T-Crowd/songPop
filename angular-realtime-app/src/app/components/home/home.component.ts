import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { NodeService } from 'src/app/services/node-service';
import { SocketioService } from 'src/app/services/socketio.service';
import { SetUser } from 'src/app/state/app.actions';
import { User } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private store: Store,
    private route: Router,
    private nodeService: NodeService,
    private socketioService: SocketioService,
    private snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  public ngOnInit(): void {
  }

  public createUser(user: User) {
    this.nodeService.register(user).subscribe(() => {
      this.store.dispatch(new SetUser(user));
      this.socketioService.connect(user);
      this.route.navigate(['lobby']);
    },
    (error) => {
      this.openSnackBar(error.error.error);

    })
  }

}