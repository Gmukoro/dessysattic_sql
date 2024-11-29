import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCurrencyRates } from "../currency";
import Cookies from "js-cookie";

export const useCurrency = () => {
  const [currencyRates, setCurrencyRates] = useState<any>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("EUR");

  // UseRef to store converted prices without causing re-renders
  const convertedPricesRef = useRef<{ [key: string]: number }>({});
  const [convertedPrices, setConvertedPrices] = useState<{
    [key: string]: number;
  }>({});

  // Load currency data and set initial selected currency
  useEffect(() => {
    const savedCurrency = Cookies.get("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }

    const loadCurrencyData = async () => {
      const rates = await fetchCurrencyRates();
      setCurrencyRates(rates);
    };

    loadCurrencyData();
  }, []);

  // Set selected currency in cookies
  useEffect(() => {
    if (selectedCurrency) {
      Cookies.set("selectedCurrency", selectedCurrency, { expires: 365 });
    }
  }, [selectedCurrency]);

  // Check for cached prices in localStorage
  useEffect(() => {
    const storedPrices = localStorage.getItem("convertedPrices");
    const storedTime = localStorage.getItem("conversionTime");
    const currentTime = Date.now();

    if (
      storedPrices &&
      storedTime &&
      currentTime - Number(storedTime) < 7 * 24 * 60 * 60 * 1000
    ) {
      setConvertedPrices(JSON.parse(storedPrices));
    }
  }, [currencyRates]);

  // Currency conversion function
  const convertPrice = useCallback(
    (price: number, from: string, to: string) => {
      if (!currencyRates || !currencyRates[to] || !currencyRates[from]) {
        return price;
      }

      const priceKey = `${price}-${from}-${to}`;

      // Return cached converted price if available in ref
      if (convertedPricesRef.current[priceKey]) {
        return convertedPricesRef.current[priceKey];
      }

      const conversionRate =
        currencyRates[to]?.value / currencyRates[from]?.value;
      const convertedPrice = price * conversionRate;

      // Round to two decimal places
      const roundedPrice = Math.round(convertedPrice * 100) / 100;

      // Store the converted price in the ref (doesn't trigger re-renders)
      convertedPricesRef.current[priceKey] = roundedPrice;

      // Return converted price directly
      return roundedPrice;
    },
    [currencyRates]
  );

  // UseEffect to update converted prices state after render
  useEffect(() => {
    // Update state only when the ref has new data
    if (Object.keys(convertedPricesRef.current).length > 0) {
      const updatedPrices = {
        ...convertedPrices,
        ...convertedPricesRef.current,
      };

      // Avoid updating state during render cycle
      setConvertedPrices(updatedPrices);

      // Save updated prices to localStorage
      localStorage.setItem("convertedPrices", JSON.stringify(updatedPrices));
      localStorage.setItem("conversionTime", Date.now().toString());
    }
  }, [currencyRates]);

  return {
    currencyRates,
    selectedCurrency,
    setSelectedCurrency,
    convertedPrices,
    convertPrice,
  };
};
