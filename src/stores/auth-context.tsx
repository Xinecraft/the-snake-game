import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const AuthContext = React.createContext<{
  user: firebase.User | null;
  userLoaded: boolean;
  logout: () => void;
  isAnonymous: boolean;
  isLoading: boolean;
  signInAnonymously: () => void;
  signInWithGoogle: () => void;
}>({
  user: null,
  userLoaded: false,
  logout: () => {
    /* Nothing! just helping the IDE */
  },
  isAnonymous: false,
  isLoading: false,
  signInAnonymously: () => {
    /* Nothing! just helping the IDE */
  },
  signInWithGoogle: () => {
    /* Nothing! just helping the IDE */
  },
});

export const AuthContextProvider = (props: React.PropsWithChildren) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  const logout = () => {
    return firebase.auth().signOut();
  };

  const signInWithGoogle = () => {
    setIsLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        setIsLoading(false);
      });
  };

  const signInAnonymously = async () => {
    setIsLoading(true);
    return firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        setIsLoading(false);
        setIsAnonymous(true);
      });
  };

  const contextValue = {
    user,
    logout,
    userLoaded,
    isAnonymous,
    isLoading,
    signInAnonymously,
    signInWithGoogle,
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setUser(user);
        setUserLoaded(true);
      });
    return () => unregisterAuthObserver();
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
