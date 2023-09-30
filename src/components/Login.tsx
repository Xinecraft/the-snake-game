import "firebase/compat/auth";
import { useContext } from "react";
import AuthContext from "../stores/auth-context";
import LeaderBoard from "./LeaderBoard";

export default function Login() {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <div className="w-full flex gap-3 justify-center mb-2">
        <button
          onClick={authCtx.signInAnonymously}
          className="relative w-48 inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
        >
          <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span className="relative w-full text-center text-gray-600 transition-colors duration-300 ease-in-out group-hover:text-white">
            Play as Guest
          </span>
        </button>

        <button
          onClick={authCtx.signInWithGoogle}
          className="relative w-48 inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
        >
          <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
          <span className="relative w-full text-center text-gray-600 transition-colors duration-300 ease-in-out group-hover:text-white">
            Signin with Google
          </span>
        </button>
      </div>

      <LeaderBoard />
    </>
  );
}
