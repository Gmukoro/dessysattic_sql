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

  useEffect(() => {
    if (selectedCurrency) {
      Cookies.set("selectedCurrency", selectedCurrency, { expires: 365 });
    }
  }, [selectedCurrency]);

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

      // Store the converted price in the ref
      convertedPricesRef.current[priceKey] = convertedPrice;

      // Update converted prices state only if it's not already cached
      setConvertedPrices((prev) => {
        const updatedPrices = { ...prev, [priceKey]: convertedPrice };

        // Save to localStorage
        localStorage.setItem("convertedPrices", JSON.stringify(updatedPrices));
        localStorage.setItem("conversionTime", Date.now().toString());

        return updatedPrices;
      });

      return convertedPrice;
    },
    [currencyRates]
  );

  return {
    currencyRates,
    selectedCurrency,
    setSelectedCurrency,
    convertedPrices,
    convertPrice,
  };
};
