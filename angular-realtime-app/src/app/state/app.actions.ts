import { User } from "../components/model";

export enum AppActionTypes {
  CLEAR = '[App] Clear',
  SET_USER = '[App] Set User',
  GET_STATE = 'App] Get',
  CONNECT = '[App] Connect',
  DISCONNECT = '[App] Disconnect',
  CONNECTED_USER = '[App] ConnectedUser',
  SET_ADMIN = '[App] SetAdmin',
  SET_LETTER_IN_PLAY = '[App] SetLetterInPlay',
  SET_ALL_CATEGORIES = '[App] SetAllCategories',
  SET_PLAYED_LETTERS = '[App] SetPlayedLetters',
  EVENT_STOP_ROUND = '[App] EventStopRound',
}

export class SetUser {
  static readonly type = AppActionTypes.SET_USER;
  constructor(public payload: User) { }
}

export class Clear {
  static readonly type = AppActionTypes.CLEAR;
  constructor(public payload: string) { }
}

export class Connect {
  static readonly type = AppActionTypes.CONNECT;
  constructor(public payload: string) { }
}

export class Disconnect {
  static readonly type = AppActionTypes.DISCONNECT;
  constructor(public payload: {}) { }
}

export class ConnectedUsers {
  static readonly type = AppActionTypes.CONNECTED_USER;
  constructor(public payload: string[]) { }
}

export class SetAdmin {
  static readonly type = AppActionTypes.SET_ADMIN;
  constructor(public payload: string) { }
}

export class SetLetterInPlay {
  static readonly type = AppActionTypes.SET_LETTER_IN_PLAY;
  constructor(public payload: string) { }
}

export class SetAllCategories {
  static readonly type = AppActionTypes.SET_ALL_CATEGORIES;
  constructor(public payload: string[]) { }
}

export class SetPlayedLetters {
  static readonly type = AppActionTypes.SET_PLAYED_LETTERS;
  constructor(public payload: string) { }
}

export class SetEventStopRound {
  static readonly type = AppActionTypes.EVENT_STOP_ROUND;
  constructor(public payload: boolean) { }
}