import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { User } from '../components/model';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ConnectedUsers, SetAdmin } from '../state/app.actions';


@Injectable({
  providedIn: 'root',
})
export class NodeService {

  constructor(
    private http: HttpClient,
    private store: Store,
  ) { }

  public register(user: User): Observable<any> {
    return this.http.post(environment.REST_ENDPOINT + '/register', { userName: user.name });
  }

  public getUsersConnected(): void {
    this.http.get<string[]>(environment.REST_ENDPOINT + '/usersConnected').subscribe(users => {
      this.store.dispatch(new ConnectedUsers(users));
    });
  }

  public getAdmin(): void {
    this.http.get<string>(environment.REST_ENDPOINT + '/admin').subscribe(admin => {
      this.store.dispatch(new SetAdmin(admin));
    });
  }

  public requestAdmin(user: User): Observable<any> {
    return this.http.post<string>(environment.REST_ENDPOINT + '/admin', { userName: user.name });
  }

}