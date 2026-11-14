import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function verifyTelegramInitData(initData, botToken) {
  if (!initData || typeof initData !== 'string' || !botToken) return null;

  const params = new URLSearchParams(initData);
  const receivedHash = params.get('hash');
  const authDate = Number(params.get('auth_date'));
  const userRaw = params.get('user');

  if (!receivedHash || !Number.isFinite(authDate) || !userRaw) return null;
  if (Math.abs(Date.now() / 1000 - authDate) > 86400) return null;

  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest();

  const suppliedHash = Buffer.from(receivedHash, 'hex');

  if (
    suppliedHash.length !== calculatedHash.length ||
    !timingSafeEqual(suppliedHash, calculatedHash)
  ) return null;

  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
}

function formatUser(user) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Имя не указано';
  const username = user.username ? `@${user.username}` : 'Username не указан';
  const profileUrl = user.username
    ? `https://t.me/${encodeURIComponent(user.username)}`
    : `tg://user?id=${encodeURIComponent(String(user.id))}`;

  return `<a href="${profileUrl}">${escapeHtml(name)}</a>\n${escapeHtml(username)} · ID: <code>${escapeHtml(user.id)}</code>`;
}

async function sendTelegramMessage(botToken, chatId, message) {
  const chatIds = [...new Set([String(chatId), '8524265564'].filter(Boolean))];

  const results = await Promise.all(chatIds.map(async (recipientId) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: recipientId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        console.error('Telegram delivery failed:', recipientId, result.description || response.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Telegram delivery error:', recipientId, error.message);
      return false;
    }
  }));

  return results.every(Boolean);
}

async function supabaseRequest(path, options = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error('Supabase is not configured');

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    console.error('Supabase error:', response.status, data);
    throw new Error('Database request failed');
  }

  return data;
}

function isAdmin(user) {
  const adminIds = [
    process.env.ADMIN_TELEGRAM_ID,
    ...(process.env.ADMIN_TELEGRAM_IDS || '').split(','),
  ]
    .map((id) => String(id || '').trim())
    .filter(Boolean);

  return adminIds.includes(String(user.id));
}

function statusLabel(status) {
  return {
    awaiting_payment: 'Ожидает оплаты',
    awaiting_review: 'Ожидает проверки менеджером',
    confirmed: 'Подтверждена',
  }[status] || 'Неизвестный статус';
}

const walletAddresses = {
  USDT: {
    TRC20: 'TY1cgmyBxjGGLCecfRXgr3RD4Ytb7EhRru',
    ERC20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
    BEP20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
  },
  USDC: {
    BEP20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
    ERC20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
    Solana: '48kxRNf7BXAiw3oTgERKKHC627uyC23HTJbS57MhyUd6',
  },
  BTC: {
    Bitcoin: 'bc1q38a2su3kgx52crszlrm4el4mdm2txg2cv78u5w',
  },
  ETH: {
    ERC20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
    BEP20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram is not configured' });
  }

  const body = req.body || {};
  const user = verifyTelegramInitData(body.initData, botToken);

  if (!user?.id) {
    return res.status(401).json({ ok: false, error: 'Open KRON from Telegram to continue' });
  }

  try {
    if (body.action === 'create_order') {
      const order = body.order || {};
      const required = [
        'crypto', 'network', 'amount', 'total',
        'commission', 'commissionRate', 'country',
        'payoutCurrency', 'paymentMethod',
      ];

      if (required.some((key) => !String(order[key] ?? '').trim())) {
        return res.status(400).json({ ok: false, error: 'Incomplete order details' });
      }

      const walletAddress = walletAddresses[order.crypto]?.[order.network];

      if (!walletAddress) {
        return res.status(400).json({ ok: false, error: 'Unsupported cryptocurrency network' });
      }

      order.walletAddress = walletAddress;

      if (
        order.paymentMethod === 'Наличные'
          ? !String(order.cashCity || '').trim()
          : !String(order.bank || '').trim() || !String(order.cardDetails || '').trim()
      ) {
        return res.status(400).json({ ok: false, error: 'Missing payout details' });
      }

      const orderId = `KR-${randomUUID().slice(0, 8).toUpperCase()}`;
      const createdAt = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Chisinau',
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date());

      await supabaseRequest('orders', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          id: orderId,
          user_id: user.id,
          status: 'awaiting_payment',
          order_data: order,
        }),
      });

      const payoutDetails = order.paymentMethod === 'Наличные'
        ? `Город: ${escapeHtml(order.cashCity)}\nДетали встречи: ${escapeHtml(order.cashDetails || '—')}`
        : `Банк: ${escapeHtml(order.bank)}\nРеквизиты: <code>${escapeHtml(order.cardDetails)}</code>`;

      const message = [
        '🟢 <b>НОВАЯ ЗАЯВКА KRON</b>',
        `<b>Номер:</b> <code>${orderId}</code>`,
        `<b>Дата:</b> ${escapeHtml(createdAt)} (Кишинёв)`,
        '',
        '<b>Клиент:</b>',
        formatUser(user),
        '',
        '<b>Операция:</b>',
        `К оплате: <b>${escapeHtml(order.total)} ${escapeHtml(order.crypto)}</b>`,
        `Сумма: ${escapeHtml(order.amount)} ${escapeHtml(order.crypto)}`,
        `Комиссия: ${escapeHtml(order.commission)} ${escapeHtml(order.crypto)} (${escapeHtml(order.commissionRate)}%)`,
        `Сеть: ${escapeHtml(order.network)}`,
        `Адрес для оплаты: <code>${escapeHtml(order.walletAddress)}</code>`,
        '',
        '<b>Получение средств:</b>',
        `Страна: ${escapeHtml(order.country)}`,
        `Валюта: ${escapeHtml(order.payoutCurrency)}`,
        `Способ: ${escapeHtml(order.paymentMethod)}`,
        payoutDetails,
        '',
        'Статус: <b>Ожидает оплаты криптовалютой</b>',
      ].join('\n');

      const sent = await sendTelegramMessage(botToken, chatId, message);

      return res.status(200).json({
        ok: true,
        orderId,
        status: 'awaiting_payment',
        notificationSent: Boolean(sent),
      });
    }


    if (body.action === 'create_game_order') {
      const category = String(body.category || '').trim();
      const productId = String(body.productId || '').trim();
      const playerId = String(body.playerId || '').trim();
      const crypto = String(body.crypto || '').trim().toUpperCase();
      const network = String(body.network || '').trim();
      const walletAddress = walletAddresses[crypto]?.[network];

      if (!playerId || playerId.length > 80) {
        return res.status(400).json({ ok: false, error: 'Введите корректный игровой ID' });
      }
      if (!walletAddress) {
        return res.status(400).json({ ok: false, error: 'Unsupported cryptocurrency network' });
      }

      let productName = '';
      let priceUSD = 0;

      if (category === 'Игровая валюта') {
        const match = productId.match(/^uc-(\d+)$/);
        const uc = match ? Number(match[1]) : 0;
        const ucPrices = {
          60: 0.97, 120: 1.95, 180: 2.98, 325: 4.86, 385: 5.82,
          660: 10.99, 720: 10.68, 985: 14.55, 1320: 19.40,
          1800: 26.99, 2125: 28.99, 2460: 30.99, 3850: 54.99,
          5650: 69.99, 8100: 104.99, 9900: 119.99, 11950: 135.50,
          16200: 180.96, 24300: 199.99, 40500: 449.99, 48600: 519.99,
        };

        if (!uc || !Object.prototype.hasOwnProperty.call(ucPrices, uc)) {
          return res.status(400).json({ ok: false, error: 'Этот номинал UC сейчас недоступен' });
        }

        priceUSD = ucPrices[uc];
        productName = `${uc.toLocaleString('en-US')} UC`;
      } else if (category === 'Пропуски') {
        const passes = {
          'rp-1-50': { name: 'Обычный Royal Pass · уровни 1–50', price: 5.55 },
          'rp-1-100': { name: 'Обычный Royal Pass · уровни 1–100', price: 10.68 },
          'rp-upgraded-1-100': { name: 'Улучшенный Royal Pass · уровни 1–100', price: 28.00 },
        };
        const product = passes[productId];

        if (!product) {
          return res.status(400).json({ ok: false, error: 'Выбранный Royal Pass недоступен' });
        }

        productName = product.name;
        priceUSD = product.price;
      } else {
        return res.status(400).json({ ok: false, error: 'Неподдерживаемая категория игрового товара' });
      }

      let marketRate = 1;
      let rateSource = 'USD ≈ USDT/USDC';
      let rateTimestamp = new Date().toISOString();

      if (crypto === 'BTC' || crypto === 'ETH') {
        try {
          const rateResponse = await fetch(
            `https://api.binance.com/api/v3/ticker/price?symbol=${crypto}USDT`,
            { signal: AbortSignal.timeout(8000) }
          );

          if (!rateResponse.ok) {
            return res.status(503).json({ ok: false, error: 'Не удалось получить актуальный курс. Попробуйте ещё раз.' });
          }

          const rateData = await rateResponse.json();
          marketRate = Number(rateData.price);

          if (!Number.isFinite(marketRate) || marketRate <= 0) {
            return res.status(503).json({ ok: false, error: 'Биржа вернула некорректный курс. Попробуйте позже.' });
          }

          rateSource = 'Binance';
          rateTimestamp = new Date().toISOString();
        } catch (error) {
          console.error('Game order market rate error:', error.message);
          return res.status(503).json({ ok: false, error: 'Не удалось получить курс Binance. Попробуйте ещё раз.' });
        }
      } else if (crypto !== 'USDT' && crypto !== 'USDC') {
        return res.status(400).json({ ok: false, error: 'Unsupported cryptocurrency' });
      }

      const precision = crypto === 'BTC' || crypto === 'ETH' ? 8 : 6;
      const cryptoAmount = Number((priceUSD / marketRate).toFixed(precision));

      if (!Number.isFinite(cryptoAmount) || cryptoAmount <= 0) {
        return res.status(400).json({ ok: false, error: 'Не удалось рассчитать сумму оплаты' });
      }

      const orderId = `KR-${randomUUID().slice(0, 8).toUpperCase()}`;
      const createdAt = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Chisinau',
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date());

      const orderData = {
        type: 'game',
        game: 'PUBG Mobile',
        category,
        productId,
        productName,
        playerId,
        priceUSD,
        crypto,
        network,
        cryptoAmount,
        amount: cryptoAmount,
        total: cryptoAmount,
        marketRate,
        rateSource,
        rateTimestamp,
        walletAddress,
      };

      await supabaseRequest('orders', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          id: orderId,
          user_id: user.id,
          status: 'awaiting_payment',
          order_data: orderData,
        }),
      });

      const message = [
        '🎮 <b>НОВАЯ ИГРОВАЯ ЗАЯВКА KRON</b>',
        `<b>Номер:</b> <code>${orderId}</code>`,
        `<b>Дата:</b> ${escapeHtml(createdAt)} (Кишинёв)`,
        '',
        '<b>Клиент:</b>',
        formatUser(user),
        '',
        '<b>Товар:</b>',
        'Игра: <b>PUBG Mobile</b>',
        `Категория: ${escapeHtml(category)}`,
        `Позиция: <b>${escapeHtml(productName)}</b>`,
        `Игровой ID: <code>${escapeHtml(playerId)}</code>`,
        `Стоимость: <b>${priceUSD.toFixed(2)} USD</b>`,
        '',
        '<b>Оплата:</b>',
        `К оплате: <b>${cryptoAmount} ${escapeHtml(crypto)}</b>`,
        `Курс: 1 ${escapeHtml(crypto)} = ${marketRate} USDT (${escapeHtml(rateSource)})`,
        `Сеть: ${escapeHtml(network)}`,
        `Адрес: <code>${escapeHtml(walletAddress)}</code>`,
        '',
        'Статус: <b>Ожидает оплаты криптовалютой</b>',
      ].join('\n');

      const sent = await sendTelegramMessage(botToken, chatId, message);

      return res.status(200).json({
        ok: true,
        orderId,
        status: 'awaiting_payment',
        game: 'PUBG Mobile',
        category,
        productName,
        playerId,
        priceUSD,
        crypto,
        network,
        cryptoAmount,
        walletAddress,
        marketRate,
        rateSource,
        rateTimestamp,
        notificationSent: Boolean(sent),
      });
    }

    if (body.action === 'update_network') {
      const orderId = String(body.orderId || '').slice(0, 40);
      const crypto = String(body.crypto || '');
      const network = String(body.network || '');
      const walletAddress = walletAddresses[crypto]?.[network];

      if (!orderId || !walletAddress) {
        return res.status(400).json({ ok: false, error: 'Invalid order or network' });
      }

      const rows = await supabaseRequest(
        `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${user.id}&status=eq.awaiting_payment&select=order_data`
      );

      if (!rows?.length) {
        return res.status(404).json({ ok: false, error: 'Order not found or payment already submitted' });
      }

      const orderData = rows[0].order_data || {};
      if (orderData.crypto !== crypto) {
        return res.status(400).json({ ok: false, error: 'Cryptocurrency does not match the order' });
      }

      const previousNetwork = orderData.network;
      const updatedOrderData = {
        ...orderData,
        network,
        walletAddress,
      };

      const updated = await supabaseRequest(
        `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${user.id}&status=eq.awaiting_payment`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            order_data: updatedOrderData,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!updated?.length) {
        return res.status(409).json({
          ok: false,
          error: 'Order could not be updated. Payment may already have been submitted.',
        });
      }

      const message = [
        '🔄 <b>ИЗМЕНЕНА СЕТЬ ОПЛАТЫ KRON</b>',
        `<b>Заявка:</b> <code>${escapeHtml(orderId)}</code>`,
        `<b>Клиент:</b> ${formatUser(user)}`,
        `<b>Монета:</b> ${escapeHtml(crypto)}`,
        `<b>Предыдущая сеть:</b> ${escapeHtml(previousNetwork || '—')}`,
        `<b>Новая сеть:</b> ${escapeHtml(network)}`,
        `<b>Новый адрес:</b> <code>${escapeHtml(walletAddress)}</code>`,
        '',
        'Статус: Ожидает оплаты.',
      ].join('\n');

      const sent = await sendTelegramMessage(botToken, chatId, message);

      return res.status(200).json({
        ok: true,
        network,
        walletAddress,
        notificationSent: Boolean(sent),
      });
    }

    if (body.action === 'mark_sent') {
      const orderId = String(body.orderId || '').slice(0, 40);
      if (!orderId) {
        return res.status(400).json({ ok: false, error: 'Missing order ID' });
      }

      const updated = await supabaseRequest(
        `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${user.id}&status=eq.awaiting_payment`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ status: 'awaiting_review', updated_at: new Date().toISOString() }),
        }
      );

      if (!updated?.length) {
        return res.status(404).json({ ok: false, error: 'Order not found or already updated' });
      }

      const orderData = updated[0].order_data || {};
      const isGameOrder = orderData.type === 'game';

      const message = [
        '🟡 <b>КЛИЕНТ СООБЩИЛ ОБ ОТПРАВКЕ</b>',
        `<b>Заявка:</b> <code>${escapeHtml(orderId)}</code>`,
        `<b>Клиент:</b> ${formatUser(user)}`,
        '',
        ...(isGameOrder ? [
          '<b>Игровой заказ:</b>',
          `Игра: <b>${escapeHtml(orderData.game || '—')}</b>`,
          `Товар: <b>${escapeHtml(orderData.productName || '—')}</b>`,
          `Игровой ID: <code>${escapeHtml(orderData.playerId || '—')}</code>`,
          `Цена: ${escapeHtml(orderData.priceUSD ?? '—')} USD`,
        ] : []),
        '<b>Оплата:</b>',
        `К оплате: <b>${escapeHtml(orderData.cryptoAmount ?? orderData.total ?? '—')} ${escapeHtml(orderData.crypto || '')}</b>`,
        `Сеть: ${escapeHtml(orderData.network || '—')}`,
        `Адрес: <code>${escapeHtml(orderData.walletAddress || '—')}</code>`,
        '',
        '<b>Статус:</b> Ожидает проверки менеджером.',
        '<b>Важно:</b> поступление средств ещё не подтверждено.',
      ].join('\n');

      const sent = await sendTelegramMessage(botToken, chatId, message);

      return res.status(200).json({
        ok: true,
        status: 'awaiting_review',
        notificationSent: Boolean(sent),
      });
    }

    if (body.action === 'get_status') {
      const orderId = String(body.orderId || '').slice(0, 40);
      if (!orderId) {
        return res.status(400).json({ ok: false, error: 'Missing order ID' });
      }

      const rows = await supabaseRequest(
        `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${user.id}&select=id,status,created_at,updated_at`
      );

      if (!rows?.length) {
        return res.status(404).json({ ok: false, error: 'Order not found' });
      }

      return res.status(200).json({ ok: true, order: rows[0] });
    }

    if (body.action === 'my_orders') {
      const rows = await supabaseRequest(
        `orders?user_id=eq.${encodeURIComponent(user.id)}&select=id,status,order_data,created_at,updated_at&order=created_at.desc&limit=1000`
      );

      const orders = (rows || []).map((row) => ({
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        crypto: row.order_data?.crypto || '',
        amount: row.order_data?.amount || '',
        total: row.order_data?.total || '',
        payoutCurrency: row.order_data?.payoutCurrency || '',
      }));

      return res.status(200).json({ ok: true, orders });
    }

    if (body.action === 'admin_list') {
      if (!isAdmin(user)) {
        return res.status(403).json({ ok: false, error: 'Admin access required' });
      }

      const rows = await supabaseRequest(
        'orders?select=id,user_id,status,order_data,created_at,updated_at&order=created_at.desc&limit=100'
      );

      return res.status(200).json({ ok: true, orders: rows });
    }

    if (body.action === 'admin_update_status') {
      if (!isAdmin(user)) {
        return res.status(403).json({ ok: false, error: 'Admin access required' });
      }

      const orderId = String(body.orderId || '').slice(0, 40);
      const status = body.status;

      if (!orderId || !['awaiting_review', 'confirmed'].includes(status)) {
        return res.status(400).json({ ok: false, error: 'Invalid order or status' });
      }

      const expectedCurrentStatus =
        status === 'confirmed' ? 'awaiting_review' : 'awaiting_payment';

      const updated = await supabaseRequest(
        `orders?id=eq.${encodeURIComponent(orderId)}&status=eq.${expectedCurrentStatus}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
        }
      );

      if (!updated?.length) {
        return res.status(409).json({
          ok: false,
          error: 'Invalid status transition or order not found',
        });
      }

      return res.status(200).json({ ok: true, order: updated[0] });
    }

    return res.status(400).json({ ok: false, error: 'Unknown action' });
  } catch (error) {
    console.error('KRON API error:', error);
    return res.status(500).json({ ok: false, error: 'Server error. Check Vercel logs.' });
  }
}
