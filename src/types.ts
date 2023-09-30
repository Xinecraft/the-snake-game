import { Timestamp } from "firebase/firestore";

export type BonusFood = {
  x: number;
  y: number;
  type: string;
};

export type ScoreType = {
  id: string;
  value: number;
  created: Date | Timestamp;
  uid: string;
  displayName: string;
};
