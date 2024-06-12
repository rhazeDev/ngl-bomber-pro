import React, { createContext, useState } from "react";

export const GameSlugContext = createContext();

export function GameSlugProvider({ children }) {
  const [gameSlug, setGameSlug] = useState("normal");

  return <GameSlugContext.Provider value={{ gameSlug, setGameSlug }}>{children}</GameSlugContext.Provider>;
}