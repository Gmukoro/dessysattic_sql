//components\CurrencyDropdownContext.tsx

"use client";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { useEffect } from "react";

const CurrencySelector = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrencyContext();

  useEffect(() => {
    // Save selected currency to localStorage when it changes
    localStorage.setItem("selectedCurrency", selectedCurrency);
  }, [selectedCurrency]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedCurrency}
        onChange={handleChange}
        className="border p-2 bg-gray-300  rounded-lg"
      >
        <option value="USD">US Dollar (USD)</option>
        <option value="EUR">Euros (EUR)</option>
        <option value="CAD">Canadian Dollar (CA$)</option>
        <option value="NGN">Nigerian Naira (₦)</option>
        <option value="GBP">British Pounds (£)</option>
      </select>
    </div>
  );
};

export default CurrencySelector;
