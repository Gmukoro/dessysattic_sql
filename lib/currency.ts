//lib\currency.ts

// lib/currency.ts
export const fetchCurrencyRates = async () => {
  const response = await fetch(
    `https://api.currencyapi.com/v3/latest?apikey=cur_live_2S4O6nmXuCkF7WSWbSb67cxQSx4wDevnevfW8p2g&currencies=EUR%2CUSD%2CCAD%2CNGN%2CGBP`
  );
  const data = await response.json();
  console.log("Exchange Rate Data:", data);
  console.log(data);
  return data.data;
};
