// lib/currency.ts
export const fetchCurrencyRates = async () => {
  const response = await fetch(
    `https://api.currencyapi.com/v3/latest?apikey=cur_live_fKs6WT1tLchYGJ5hnzmQX4qLMzEHULKMsJtXrBWr&currencies=EUR%2CUSD%2CCAD%2CNGN%2CGBP&base_currency=EUR`
  );
  const data = await response.json();
  console.log("Exchange Rate Data:", data);
  console.log(data);
  return data.data;
};
