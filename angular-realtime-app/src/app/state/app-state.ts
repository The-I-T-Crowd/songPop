import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { User } from '../components/model';
import { SetUser, Clear, Connect, Disconnect, ConnectedUsers, SetAdmin, SetAllCategories, SetLetterInPlay, SetPlayedLetters, SetEventStopRound } from './app.actions';

export interface AppStateModel {
  user: User,
  socketId: string,
  connectedUsers: string[],
  admin: string,
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    user: null,
    socketId: null,
    connectedUsers: [],
    admin: null,
  }
})
@Injectable()
export class AppState {

  @Selector()
  static getUser(state: AppStateModel) {
    return state.user;
  }

  @Selector()
  static getConnect(state: AppStateModel) {
    return state.socketId;
  }

  @Selector()
  static getDisconnect(state: AppStateModel) {
    return;
  }

  @Selector()
  static getConnectedUser(state: AppStateModel) {
    return state.connectedUsers;
  }

  @Selector()
  static getAdmin(state: AppStateModel) {
    return state.admin;
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AppStateModel>, { payload }: SetUser) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      user: payload,
    });
  }

  @Action(Clear)
  clear(ctx: StateContext<AppStateModel>, { payload }: Clear) {
    ctx.setState({
      user: null,
      socketId: null,
      connectedUsers: [],
      admin: null,
    })
  }

  @Action(ConnectedUsers)
  connectedUsers(ctx: StateContext<AppStateModel>, { payload }: ConnectedUsers) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      connectedUsers: payload,
    });
  }

  @Action(Connect)
  connect(ctx: StateContext<AppStateModel>, { payload }: Connect) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      socketId: payload,
    });
  }

  @Action(Disconnect)
  disconnect(ctx: StateContext<AppStateModel>, { payload }: Disconnect) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      socketId: null,
    });
  }

  @Action(SetAdmin)
  setAdmin(ctx: StateContext<AppStateModel>, { payload }: SetAdmin) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      admin: payload,
    });
  }

}