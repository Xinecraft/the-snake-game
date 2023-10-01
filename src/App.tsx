import { useContext } from "react";
import SnakeBoard from "./components/SnakeBoard";
import Login from "./components/Login";
import AuthContext from "./stores/auth-context";
import Loading from "./components/Loading";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <h1 className="text-center fancy text-teal-300 text-7xl pb-2">
        The Snake Game
      </h1>

      {!authCtx.user && authCtx.userLoaded && !authCtx.isLoading && <Login />}

      {authCtx.user && authCtx.userLoaded && (
        <>
          <SnakeBoard />
        </>
      )}

      {(!authCtx.userLoaded || authCtx.isLoading) && (
        <div className="w-full flex justify-center">
          <Loading />
        </div>
      )}

      {authCtx.user && (
        <div className="absolute right-10 top-5">
          <button
            onClick={authCtx.logout}
            className="text-red-400 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default App;
