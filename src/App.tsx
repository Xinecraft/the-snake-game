import Board from "./components/Board";
import { useSnakeGame } from "./hooks/useSnakeGame";

function App() {
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

  return (
    <>
      <h1 className="text-center fancy text-teal-300 text-7xl -mt-10 pb-2">
        The Snake Game
      </h1>
      <Board
        isGameOver={isGameOver}
        restartGame={restartGame}
        snake={snake}
        food={food}
        board={board}
        bonusFood={bonusFood}
      />

      <div className="flex text-2xl justify-between fancy mt-2 text-zinc-300">
        <div>Score: {score}</div>
        <div>Level: {level}</div>
      </div>
    </>
  );
}

export default App;
