import { BOARD_SIZE } from "./constants";

export const getRandomTileInBoard = () => {
  return [
    Math.floor(Math.random() * BOARD_SIZE),
    Math.floor(Math.random() * BOARD_SIZE),
  ];
};

export const isSameDirection = (dir1: number[], dir2: number[]) => {
  return dir1[0] === dir2[0] && dir1[1] === dir2[1];
};
