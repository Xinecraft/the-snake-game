import { useEffect, useState } from "react";
import {
  BOARD_SIZE,
  BONUS_FOOD_CHANCE,
  DIRECTIONS,
  INITIAL_FOOD,
  INITIAL_SNAKE,
  INITIAL_SNAKE_SPEED_MS,
} from "../helpers/constants";
import { useInterval } from "../hooks/useInterval";
import { isSameDirection, getRandomTileInBoard } from "../helpers/functions";
import { BonusFood } from "../types";
import { useFirestore } from "./useFirestore";

const board = Array.from(Array(BOARD_SIZE), () =>
  new Array(BOARD_SIZE).fill(0)
);

export function useSnakeGame() {
  const [snake, setSnake] = useState<number[][]>(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [ateCount, setAteCount] = useState(0);
  const [snakeSpeed, setSnakeSpeed] = useState(INITIAL_SNAKE_SPEED_MS);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bonusFood, setBonusFood] = useState<BonusFood | null>(null);
  const { addScoreForUser } = useFirestore();

  function runGame() {
    if (checkCollision()) {
      onGameOver();
      return;
    }
    handleSnakeMovement();
  }

  function onGameOver() {
    setIsGameOver(true);
    addScoreToFirestore(score);
  }

  function addScoreToFirestore(score: number) {
    addScoreForUser(score).catch(err => {
      console.log("error adding score", err);
    });
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

  function handleSnakeMovement() {
    const snakeCopy = [...snake];
    const head = snakeCopy[0];

    const directionToMove = direction;
    const newHead = [
      head[0] + directionToMove[0],
      head[1] + directionToMove[1],
    ];

    snakeCopy.unshift(newHead);

    handleBonusFoodEat();
    if (!handleFoodEat()) {
      snakeCopy.pop();
    }

    setSnake(snakeCopy);
  }

  function handleBonusFoodEat() {
    const head = snake[0];
    if (bonusFood && head[0] === bonusFood.x && head[1] === bonusFood.y) {
      onBonusFoodAte();
    }
  }

  function onBonusFoodAte() {
    setAteCount((prev) => prev + 1);
    const bonusFoodType = bonusFood?.type;
    if (bonusFoodType === "double_score") {
      setScore((prev) => prev * 2);
    }
    setBonusFood(null);
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
    setScore((prev) => prev + 5);
    setAteCount((prev) => prev + 1);
    generateNewFood();
    generateBonusFood();
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

  function generateBonusFood() {
    let randomCord = getRandomTileInBoard();
    while (
      snake.some(
        (cell) => cell[0] === randomCord[0] && cell[1] === randomCord[1]
      ) ||
      (food[0] === randomCord[0] && food[1] === randomCord[1])
    ) {
      randomCord = getRandomTileInBoard();
    }

    // one in 10 chance of generating bonus food.
    if (Math.random() < BONUS_FOOD_CHANCE) {
      const bonusFoodType = "double_score";
      setBonusFood({
        x: randomCord[0],
        y: randomCord[1],
        type: bonusFoodType,
      });
    } else {
      setBonusFood(null);
    }
  }

  function restartGame() {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setLevel(1);
    setScore(0);
    setAteCount(0);
    setSnakeSpeed(INITIAL_SNAKE_SPEED_MS);
    setDirection(DIRECTIONS.RIGHT);
    setIsGameOver(false);
    setBonusFood(null);
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
   */
  useEffect(() => {
    if (ateCount % 7 === 0 && ateCount !== 0) {
      setLevel((prev) => prev + 1);

      // don't increase speed if below 50ms, not possible to play.
      if (snakeSpeed <= 50) {
        return;
      }
      setSnakeSpeed((prev) => prev - 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ateCount]);

  return {
    board,
    snake,
    food,
    level,
    score,
    isGameOver,
    bonusFood,
    direction,
    setDirection,
    restartGame,
  };
}
