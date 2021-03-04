export class User {
    name: string;
    score?: Number;

    constructor(name: string) {
        this.name = name;
    }

    isValid(): boolean {
        return !!this.name;
    }
}

export interface IGame {
    musicRound: string;
}

export interface ICategory {
    name: string;
    currentCapacity: number;
}



