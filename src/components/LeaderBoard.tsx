import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { ScoreType } from "../types";

export default function LeaderBoard() {
  const [top50, setTop50] = useState<ScoreType[]>([]);
  const { getTopLeaderboard } = useFirestore();

  useEffect(() => {
    getTopLeaderboard(50).then((list) => {
      setTop50(list);
    });
  }, []);

  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg mt-20 max-h-96 overflow-y-auto">
        <div className="bg-teal-400 text-white py-2 px-6 rounded-t-lg">
          <h1 className="text-4xl fancy mt-2">Leaderboard</h1>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold"># &nbsp; Name</span>
            <span className="font-semibold">Score</span>
          </div>

          {top50.map((score, i) => (
            <div key={i} className="flex items-center justify-between mb-2">
              <span>
                {i + 1} &nbsp;{" "}
                {score.displayName ? score.displayName : <i>Guest</i>}
              </span>
              <span>{score.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
