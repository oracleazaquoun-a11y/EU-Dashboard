export default async function handler(req, res) {
  const { symbols } = req.query;

  const apiKey = process.env.FINNHUB_KEY;

  try {
    const results = await Promise.all(
      symbols.split(",").map(async (s) => {
        const r = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${s}&token=${apiKey}`
        );
        const data = await r.json();

        return {
          symbol: s,
          price: data.c || 0,
          prev: data.pc || 0
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
