export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method not allowed');
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const fileId = String(req.query?.file_id || '');

  if (!botToken || !fileId || fileId.length > 512) {
    return res.status(400).end('Invalid request');
  }

  try {
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`,
      { signal: AbortSignal.timeout(10000) }
    );

    const fileResult = await fileResponse.json();

    if (!fileResponse.ok || !fileResult.ok || !fileResult.result?.file_path) {
      return res.status(404).end('Image not found');
    }

    const filePath = fileResult.result.file_path;

    if (!/^[a-zA-Z0-9_./-]+$/.test(filePath) || filePath.includes('..')) {
      return res.status(400).end('Invalid file path');
    }

    const imageResponse = await fetch(
      `https://api.telegram.org/file/bot${botToken}/${filePath}`,
      { signal: AbortSignal.timeout(15000) }
    );

    if (!imageResponse.ok) {
      return res.status(502).end('Image unavailable');
    }

    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    const extension = filePath.split('.').pop().toLowerCase();

    const mimeTypes = {
      webp: 'image/webp',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };

    const contentType = mimeTypes[extension];

    if (!contentType) {
      return res.status(415).end('Unsupported image format');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', String(bytes.length));
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    return res.status(200).send(bytes);
  } catch (error) {
    console.error('Telegram gift image error:', error);
    return res.status(502).end('Image service temporarily unavailable');
  }
}
