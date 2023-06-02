import { ObjectId } from "bson";

export interface playerprops {
  _id?: ObjectId;
  GAME_ID: number;
  SHOT_NUMBER: number;
  PERIOD: number;
  SHOT_RESULT: string;
  CLOSEST_DEFENDER: string;
  PLAYER_NAME: string;
}
