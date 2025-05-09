import { useContext } from "react";
import { AppContext } from "../store/AppContext";

export const useAppContext = () => {
  const context = useContext(AppContext); //context has now dispatch and state properties

  if (!context) {
    throw Error("useAppContext must be used inside an AppContextProvider");
  }

  return context;
};