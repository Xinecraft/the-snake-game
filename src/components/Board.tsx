import { BonusFood } from "../types";

type Props = {
  board: number[][];
  snake: number[][];
  food: number[];
  bonusFood: BonusFood | null;
};

export default function Board({ board, snake, food, bonusFood }: Props) {
  return (
    <div className="board border-4 border-zinc-700 rounded">
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((col, j) => {
            const isSnake = snake.some(
              (cell) => cell[0] === i && cell[1] === j
            );
            const isFood = food[0] === i && food[1] === j;
            const isBonusFood = bonusFood?.x === i && bonusFood?.y === j;

            const cellClass = isSnake
              ? "bg-zinc-400"
              : isFood
              ? "bg-green-500"
              : isBonusFood
              ? "bg-yellow-500"
              : "";

            return (
              <span
                key={"cell" + i + j}
                className={
                  `cell w-8 h-8 inline-flex items-center justify-center flex-col rounded-lg ` +
                  cellClass
                }
              >
                {/* <span>{i + j}</span> */}
                {/* <span className="text-xs text-gray-500">
                  {i}, {j}
                </span> */}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
