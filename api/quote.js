export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "Missing symbols" });
  }

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
          price: data.c,
          prev: data.pc
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
}
