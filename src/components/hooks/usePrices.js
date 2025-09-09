import { useState, useEffect } from "react";

const symbolMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
};

export function usePrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  return { prices, loading, symbolMap };
}
