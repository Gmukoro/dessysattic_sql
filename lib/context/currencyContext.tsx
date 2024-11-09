"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useCurrency } from "../hooks/useCurrency";

export interface CurrencyContextType {
  currencyRates: { [key: string]: { value: number } } | null;
  convertedPrices: { [key: string]: number };
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  convertPrice: (price: number, from: string, to: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
    currencyRates,
    convertedPrices,
  } = useCurrency();

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        currencyRates,
        convertedPrices,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      "useCurrencyContext must be used within a CurrencyProvider"
    );
  }
  return context;
};
