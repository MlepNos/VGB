import React, { createContext, useReducer, useEffect } from "react";

const initialState = {
  games: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_GAMES":
      return { ...state, games: action.payload };
    case "ADD_GAME":
      return { ...state, games: [...state.games, action.payload] };
    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchGames = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/game");
      const data = await response.json();
      dispatch({ type: "SET_GAMES", payload: data });
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };
  const addGame = (game) => {
  dispatch({ type: "ADD_GAME", payload: game });
};

  useEffect(() => {
    fetchGames();
  }, []);

  const value = {
    ...state,
    fetchGames,
    addGame
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
