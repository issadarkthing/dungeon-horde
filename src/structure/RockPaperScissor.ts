import { random } from "./utils";

export enum Options {
  ROCK = "rock",
  PAPER = "paper",
  SCISSORS = "scissors",
};

export enum Result {
  WIN = "win",
  DRAW = "draw",
  LOSE = "lose",
}

export class RockPaperScissors {

  static random(p1: Options) {
    const picked = random().pick(Object.values(Options));
    return RockPaperScissors.play(p1, picked);
  }

  static play(p1: Options, p2: Options) {

    switch (true) {
      case p1 === Options.ROCK && p2 === Options.ROCK: return Result.DRAW;
      case p1 === Options.PAPER && p2 === Options.PAPER: return Result.DRAW;
      case p1 === Options.SCISSORS && p2 === Options.SCISSORS: return Result.DRAW;
      
      case p1 === Options.ROCK && p2 === Options.PAPER: return Result.WIN;
      case p1 === Options.PAPER && p2 === Options.ROCK: return Result.LOSE;

      case p1 === Options.SCISSORS && p2 === Options.PAPER: return Result.WIN;
      case p1 === Options.PAPER && p2 === Options.SCISSORS: return Result.LOSE;

      case p1 === Options.ROCK && p2 === Options.SCISSORS: return Result.WIN;
      case p1 === Options.SCISSORS && p2 === Options.ROCK: return Result.LOSE;

      default: return Result.DRAW;
    }
  }
}
