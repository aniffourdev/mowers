"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface MyContextType {
  value: string;
}

const MyContext = createContext<MyContextType | null>(null);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const value = "Some Value";
  return <MyContext.Provider value={{ value }}>{children}</MyContext.Provider>;
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === null) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
