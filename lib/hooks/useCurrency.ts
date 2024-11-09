import { useState, useEffect, useCallback } from "react";
import { fetchCurrencyRates } from "../currency";
import Cookies from "js-cookie";

export const useCurrency = () => {
  const [currencyRates, setCurrencyRates] = useState<any>(null);
  const [convertedPrices, setConvertedPrices] = useState<{
    [key: string]: number;
  }>({});
  const [pendingConversions, setPendingConversions] = useState<{
    [key: string]: number;
  }>({});
  const [selectedCurrency, setSelectedCurrency] = useState<string>("EUR");

  useEffect(() => {
    // Check cookies for saved currency (if any)
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
    // Load converted prices from local storage if still valid (within 7 days)
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

  useEffect(() => {
    // Apply pending conversions after render
    setConvertedPrices((prev) => {
      const updatedPrices = { ...prev, ...pendingConversions };
      localStorage.setItem("convertedPrices", JSON.stringify(updatedPrices));
      localStorage.setItem("conversionTime", Date.now().toString());
      return updatedPrices;
    });
  }, [pendingConversions]);

  const convertPrice = useCallback(
    (price: number, from: string, to: string) => {
      if (!currencyRates || !currencyRates[to] || !currencyRates[from]) {
        return price;
      }

      const priceKey = `${price}-${from}-${to}`;
      if (convertedPrices[priceKey]) {
        return convertedPrices[priceKey];
      }

      const conversionRate =
        currencyRates[to]?.value / currencyRates[from]?.value;
      const convertedPrice = price * conversionRate;

      // Store the converted price in pending conversions
      setPendingConversions((prev) => ({
        ...prev,
        [priceKey]: convertedPrice,
      }));

      return convertedPrice;
    },
    [currencyRates, convertedPrices]
  );

  return {
    currencyRates,
    convertedPrices,
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
  };
};
