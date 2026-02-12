export const fetchTopCurrencies = async (limit = 50) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
        throw new Error("Failed to fetch data from CoinGecko");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
};
