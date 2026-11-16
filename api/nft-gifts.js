let cache = null;
let cacheUntil = 0;

const API = 'https://' + 'starprice.net/api/v1/gifts';

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Starprice: HTTP ${response.status}`);
  return response.json();
}

function getDiscount(rarity, lots) {
  if (rarity <= 1 || lots <= 2) return 0;
  if (rarity > 10 || lots >= 5) return 5;
  return 2;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  try {
    if (cache && Date.now() < cacheUntil) {
      return res.status(200).json(cache);
    }

    const index = await getJson(API);
    const gramRub = Number(index.rates?.gram_rub);
    const starRub = Number(index.rates?.star_rub);

    if (!Array.isArray(index.gifts) || !gramRub || !starRub) {
      throw new Error('Некорректный ответ Starprice');
    }

    const usdData = await getJson('https://www.cbr-xml-daily.ru/daily_json.js');
    const usdRub = Number(usdData.Valute?.USD?.Value);
    if (!Number.isFinite(usdRub) || usdRub <= 0) {
      throw new Error('Некорректный курс RUB/USD');
    }

    const collections = index.gifts;
    const results = [];
    let cursor = 0;

    const workers = Array.from({ length: 8 }, async () => {
      while (cursor < collections.length) {
        const collection = collections[cursor++];
        try {
          const data = await getJson(`${API}/${encodeURIComponent(collection.slug)}`);

          for (const model of data.models || []) {
            const offer = model.offers?.find(item => item.market === 'fragment');
            if (!offer) continue;

            const fragmentRub = Number(offer.rub) ||
              Number(offer.price) * gramRub;
            const lots = Number(offer.lots) || 0;
            const rarity = Number(model.rarity_pct) || 0;

            if (!Number.isFinite(fragmentRub) || fragmentRub <= 0) continue;

            const discount = getDiscount(rarity, lots);
            const priceRub = Math.round(fragmentRub * (1 - discount / 100));
            const priceUSD = Number((priceRub / usdRub).toFixed(2));
            const stars = Math.ceil(priceRub / starRub);

            results.push({
              id: `${collection.slug}:${model.slug}`,
              collectionSlug: collection.slug,
              collectionName: collection.name,
              modelSlug: model.slug,
              name: model.name,
              image: model.image || null,
              rarityPct: rarity,
              issued: model.issued ?? null,
              lots,
              fragmentPriceRub: Math.round(fragmentRub),
              discount,
              priceRub,
              priceUSD,
              stars,
            });
          }
        } catch (error) {
          console.error('NFT collection error:', collection.slug, error.message);
        }
      }
    });

    await Promise.all(workers);
    results.sort((a, b) => a.priceRub - b.priceRub);

    const payload = {
      ok: true,
      gifts: results,
      updatedAt: new Date().toISOString(),
    };

    cache = payload;
    cacheUntil = Date.now() + 5 * 60 * 1000;

    return res.status(200).json(payload);
  } catch (error) {
    console.error('NFT gifts API error:', error);
    return res.status(502).json({
      ok: false,
      error: 'Не удалось загрузить NFT-подарки.',
    });
  }
}
