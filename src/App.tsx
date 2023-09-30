import { useEffect, useState } from "react";

import Board from "./components/Board";
import {
  BOARD_SIZE,
  DIRECTIONS,
  INITIAL_FOOD,
  INITIAL_SNAKE,
  INITIAL_SNAKE_SPEED_MS,
} from "./helpers/constants";
import { useInterval } from "./hooks/useInterval";
import { isSameDirection, getRandomTileInBoard } from "./helpers/functions";

const board = Array.from(Array(BOARD_SIZE), () =>
  new Array(BOARD_SIZE).fill(0)
);

function App() {
  const [snake, setSnake] = useState<number[][]>(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [level, setLevel] = useState(1); // more the level, faster the snake.
  const [score, setScore] = useState(0);
  const [snakeSpeed, setSnakeSpeed] = useState(INITIAL_SNAKE_SPEED_MS);
  const [direction, setDirection] = useState(DIRECTIONS.DOWN);
  const [isGameOver, setIsGameOver] = useState(false);

  function runGame() {
    if (checkCollision()) {
      onGameOver();
      return;
    }
    handleSnakeMovement();
  }

  function onGameOver() {
    setIsGameOver(true);
  }

  function handleSnakeMovement() {
    const snakeCopy = [...snake];
    const head = snakeCopy[0];

    const directionToMove = direction;
    const newHead = [
      head[0] + directionToMove[0],
      head[1] + directionToMove[1],
    ];

    snakeCopy.unshift(newHead);

    if (!handleFoodEat()) {
      snakeCopy.pop();
    }

    setSnake(snakeCopy);
  }

  function handleFoodEat(): boolean {
    const head = snake[0];
    if (head[0] === food[0] && head[1] === food[1]) {
      onFoodAte();
      return true;
    }
    return false;
  }

  function onFoodAte() {
    growSnake(1);
    setScore((prev) => prev + 1);
    generateNewFood();
  }

  function growSnake(size: number) {
    const snakeCopy = [...snake];
    for (let i = 0; i < size; i++) {
      snakeCopy.push(snakeCopy[snakeCopy.length - 1]);
    }
    setSnake(snakeCopy);
  }

  function generateNewFood() {
    let randomCord = getRandomTileInBoard();
    while (
      snake.some(
        (cell) => cell[0] === randomCord[0] && cell[1] === randomCord[1]
      )
    ) {
      randomCord = getRandomTileInBoard();
    }

    setFood(randomCord);
  }

  function checkCollision() {
    // Check if snake hits the wall.
    const head = snake[0];
    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= BOARD_SIZE ||
      head[1] >= BOARD_SIZE
    ) {
      return true;
    }

    // Check if snake bites itself.
    const snakeCopy = [...snake];
    const snakeBody = snakeCopy.slice(1);
    return snakeBody.some((cell) => cell[0] === head[0] && cell[1] === head[1]);
  }

  useInterval(
    () => {
      runGame();
    },
    isGameOver ? null : snakeSpeed
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          if (isSameDirection(direction, DIRECTIONS.RIGHT)) return;
          setDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (isSameDirection(direction, DIRECTIONS.LEFT)) return;
          setDirection(DIRECTIONS.RIGHT);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (isSameDirection(direction, DIRECTIONS.UP)) return;
          setDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          if (isSameDirection(direction, DIRECTIONS.DOWN)) return;
          setDirection(DIRECTIONS.UP);
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  /**
   * Increase speed with Level.
   * TODO: Make it better.
   * 1. Gradually increase instead of sudden increase.
   * 2. Don't go below 50ms.
   * 3. On each level up notify user.
   */
  useEffect(() => {
    if (score % 5 === 0 && score !== 0) {
      setLevel((prev) => prev + 1);
      setSnakeSpeed((prev) => prev - 100);
    }
  }, [score]);

  return (
    <>
      <div className="fancy">
        <h1>Snake Game</h1>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
      </div>
      <Board snake={snake} food={food} board={board} />

      {isGameOver && <div>Game Over</div>}
    </>
  );
}

export default App;
