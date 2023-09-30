import {
  query,
  orderBy,
  where,
  getFirestore,
  collection,
  addDoc,
  limit,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useContext } from "react";
import AuthContext from "../stores/auth-context";
import { ScoreType } from "../types";

export function useFirestore() {
  const db = getFirestore();
  const authCtx = useContext(AuthContext);

  const addScoreForUser = async (score: number) => {
    if (!authCtx.user) {
      return false;
    }

    try {
      await addDoc(collection(db, "scores"), {
        value: score,
        created: serverTimestamp(),
        uid: authCtx.user?.uid,
        displayName: authCtx.user?.displayName,
      });
    } catch (err) {
      console.error("Error while adding score", err);
    }
  };

  const getScoresForUser = async () => {
    if (!authCtx.user) {
      return false;
    }

    const q = query(
      collection(db, "scores"),
      where("uid", "==", authCtx.user.uid),
      orderBy("value", "desc")
    );

    const querySnapshot = await getDocs(q);
    const scores: ScoreType[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ ...doc.data(), id: doc.id } as ScoreType);
    });

    return scores;
  };

  const getTopLeaderboard = async (count: number) => {
    const q = query(
      collection(db, "scores"),
      orderBy("value", "desc"),
      limit(count)
    );

    const querySnapshot = await getDocs(q);
    const scores: ScoreType[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ ...doc.data(), id: doc.id } as ScoreType);
    });

    return scores;
  };

  return {
    db,
    addScoreForUser,
    getScoresForUser,
    getTopLeaderboard,
  };
}
