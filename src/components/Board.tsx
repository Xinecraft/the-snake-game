type Props = {
  board: number[][];
  snake: number[][];
  food: number[];
};

export default function Board({ board, snake, food }: Props) {
  return (
    <>
      {board.map((row, i) => (
        <div key={i} className="row">
          {row.map((col, j) => {
            const isSnake = snake.some(
              (cell) => cell[0] === i && cell[1] === j
            );
            const isFood = food[0] === i && food[1] === j;

            const cellClass = isSnake
              ? "bg-green-500"
              : isFood
              ? "bg-red-500"
              : "";

            return (
              <span
                key={"cell" + i + j}
                className={
                  `cell w-12 h-12 inline-flex border items-center justify-center flex-col ` +
                  cellClass
                }
              >
                <span>{i + j}</span>
                <span className="text-xs text-gray-500">
                  {i}, {j}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
}
