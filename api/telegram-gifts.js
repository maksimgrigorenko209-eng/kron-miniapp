export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return res.status(500).json({ ok: false, error: 'Telegram bot is not configured' });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getAvailableGifts`,
      { signal: AbortSignal.timeout(10000) }
    );

    const result = await response.json();

    if (!response.ok || !result.ok || !Array.isArray(result.result?.gifts)) {
      console.error('getAvailableGifts failed:', result.description || response.status);
      return res.status(502).json({ ok: false, error: 'Не удалось загрузить подарки Telegram.' });
    }

    const gifts = result.result.gifts.map((gift) => {
      const sticker = gift.sticker || {};
      const thumbnail = sticker.thumbnail || null;
      const isAnimated = Boolean(sticker.is_animated);
      const isVideo = Boolean(sticker.is_video);

      // Для анимированных и видеостикеров используем только статичную миниатюру.
      const imageFileId = thumbnail?.file_id
        || (!isAnimated && !isVideo ? sticker.file_id : null);

      return {
        id: String(gift.id),
        starCount: Number(gift.star_count) || 0,
        upgradeStarCount: Number(gift.upgrade_star_count) || null,
        totalCount: gift.total_count ?? null,
        remainingCount: gift.remaining_count ?? null,
        personalTotalCount: gift.personal_total_count ?? null,
        personalRemainingCount: gift.personal_remaining_count ?? null,
        isPremium: Boolean(gift.is_premium),
        emoji: sticker.emoji || '',
        imageUrl: imageFileId
          ? `/api/telegram-gift-image?file_id=${encodeURIComponent(imageFileId)}`
          : null,
      };
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, gifts });
  } catch (error) {
    console.error('Telegram gifts error:', error);
    return res.status(502).json({ ok: false, error: 'Сервис подарков Telegram временно недоступен.' });
  }
}
