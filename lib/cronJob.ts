// lib/currencyScheduler.ts
import cron from "node-cron";
import { fetchCurrencyRates } from "./currency";

cron.schedule("0 0 */5 * *", async () => {
  try {
    await fetchCurrencyRates();
    console.log(
      "Currency rates fetched and saved successfully every five days."
    );
  } catch (err) {
    console.error("Error fetching and saving currency rates:", err);
  }
});
