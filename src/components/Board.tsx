import { BonusFood } from "../types";

type Props = {
  board: number[][];
  snake: number[][];
  food: number[];
  bonusFood: BonusFood | null;
  isGameOver: boolean;
  restartGame: () => void;
};

export default function Board({
  board,
  snake,
  food,
  bonusFood,
  restartGame,
  isGameOver,
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="board border-4 border-zinc-700 relative inline-block">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((_, j) => {
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

        {isGameOver && (
          <div
            onClick={restartGame}
            className="cursor-pointer fancy text-red-500 text-9xl absolute w-full h-full top-0 flex justify-center items-center bg-opacity-10 bg-red-500 text-center"
          >
            Game
            <br />
            Over
          </div>
        )}
      </div>
    </div>
  );
}
