import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useSnakeGame } from "../hooks/useSnakeGame";

export default function SnakeBoard() {
  const {
    board,
    snake,
    food,
    level,
    score,
    isGameOver,
    bonusFood,
    restartGame,
  } = useSnakeGame();
  const [highScore, setHighScore] = useState<number>(0);
  const { getScoresForUser } = useFirestore();

  useEffect(() => {
    getScoresForUser(1).then((list) => {
      setHighScore(list[0]?.value || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver, highScore]);

  return (
    <div className="flex items-center justify-center flex-col">
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

      <div className="flex text-2xl justify-between fancy mt-2 text-zinc-300 w-full">
        <div>Score: {score}</div>
        <div>Hi: {highScore}</div>
        <div>Level: {level}</div>
      </div>
    </div>
  );
}
