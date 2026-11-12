
import { useState, useEffect } from 'react';
import './App.css';
import {
  WalletTrust,
  WalletMetamask,
  WalletOkx,
  WalletTokenPocket,
  ExchangeBinance,
  ExchangeBybit,
} from '@web3icons/react';

const currencies = [
  { id: 'USDT', name: 'Tether', rate: '1 USDT = 1 USD', commission: 4, icon: '₮' },
  { id: 'USD', name: 'Доллар США', rate: '1 USD = 1 USD', commission: 4, icon: '$' },
  { id: 'EUR', name: 'Евро', rate: '1 EUR = 1,10 USD', commission: 5, icon: '€' },
  { id: 'LOCAL', name: 'Местная валюта', rate: 'Уточняйте у менеджера', commission: 2, icon: '₽' },
];

const cryptoCurrencies = [
  { id: 'USDT', limit: 20, max: 10000 },
  { id: 'USDC', limit: 20, max: 10000 },
  { id: 'BTC', limit: 50, max: 10000 },
  { id: 'ETH', limit: 30, max: 10000 },
];

const networksByCrypto = {
  USDT: ['TRC20', 'ERC20', 'BEP20'],
  USDC: ['BEP20', 'ERC20', 'Solana'],
  BTC: ['Bitcoin'],
  ETH: ['BEP20'],
};

const addressesByCrypto = {
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
    BEP20: '0xC23a1011aF8C5CECdC1a03a3f6c3F08f5D2afcd9',
  },
};

const wallets = [
  { id: 'trust', name: 'Trust Wallet', url: 'https://trustwallet.com/', icon: WalletTrust },
  { id: 'binance', name: 'Binance', url: 'https://www.binance.com/', icon: ExchangeBinance },
  { id: 'bybit', name: 'Bybit', url: 'https://www.bybit.com/', icon: ExchangeBybit },
  { id: 'okx', name: 'OKX Wallet', url: 'https://www.okx.com/web3', icon: WalletOkx },
  { id: 'metamask', name: 'MetaMask', url: 'https://metamask.io/', icon: WalletMetamask },
  { id: 'tokenpocket', name: 'TokenPocket', url: 'https://www.tokenpocket.pro/', icon: WalletTokenPocket },
];

const countries = [
  { id: 'MD', name: 'Молдова', local: 'MDL' },
  { id: 'RU', name: 'Россия', local: 'RUB' },
  { id: 'UA', name: 'Украина', local: 'UAH' },
  { id: 'BY', name: 'Беларусь', local: 'BYN' },
  { id: 'RO', name: 'Румыния', local: 'RON' },
  { id: 'KZ', name: 'Казахстан', local: 'KZT' },
];

const banksByCountry = {
  MD: ['maib', 'Moldindconbank', 'Victoriabank', 'OTP Bank'],
  RU: ['Сбербанк', 'Т-Банк', 'ВТБ', 'Альфа-Банк'],
  UA: ['PrivatBank', 'monobank', 'Ощадбанк', 'ПУМБ'],
  BY: ['Беларусбанк', 'Приорбанк', 'МТБанк', 'Белагропромбанк'],
  RO: ['Banca Transilvania', 'BCR', 'ING Bank', 'Raiffeisen Bank'],
  KZ: ['Kaspi Bank', 'Halyk Bank', 'ForteBank', 'Freedom Bank'],
};

function App() {
  const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const [page, setPage] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('MD');
  const [payoutCurrency, setPayoutCurrency] = useState('MDL');
  const [paymentMethod, setPaymentMethod] = useState('Visa');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardDetails, setCardDetails] = useState('');
  const [cashCity, setCashCity] = useState('');
  const [cashDetails, setCashDetails] = useState('');
  const [orderId, setOrderId] = useState(
    () => localStorage.getItem('kronOrderId') || ''
  );
  const [orderStatus, setOrderStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  const sections = [
    { icon: '💱', title: 'Курс валют', desc: 'Актуальные курсы валют' },
    { icon: '🔄', title: 'Обмен', desc: 'Обменные операции' },
    { icon: '🎁', title: 'Предложения', desc: 'Специальные предложения' },
    { icon: '🎧', title: 'Поддержка', desc: 'Связь с менеджером' },
  ];

  const selectedCrypto = cryptoCurrencies.find(
    (currency) => currency.id === selectedCurrency
  );

  const numericAmount = Math.max(0, Number(amount) || 0);

  const commission = payoutCurrency === 'USD'
    ? 4
    : payoutCurrency === 'EUR'
      ? 5
      : 2;

  const commissionAmount = numericAmount * commission / 100;
  const totalAmount = numericAmount + commissionAmount;

  const formatNumber = (value) =>
    new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 8,
    }).format(value);

  const handleCountryChange = (event) => {
    const country = countries.find(
      (item) => item.id === event.target.value
    );

    setSelectedCountry(country.id);
    setPayoutCurrency(country.local);
  };

  const sendOrderAction = async (action, extra = {}) => {
    const initData = window.Telegram?.WebApp?.initData;

    if (!initData) {
      throw new Error('Откройте KRON через Telegram.');
    }

    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, initData, ...extra }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(
        response.status === 401
          ? 'Не удалось подтвердить Telegram. Перезапустите Mini App.'
          : 'Не удалось отправить уведомление. Попробуйте ещё раз.'
      );
    }

    return result;
  };

  const loadOrderStatus = async () => {
    if (!orderId) return;

    setStatusLoading(true);
    try {
      const result = await sendOrderAction('get_status', { orderId });
      setOrderStatus(result.order.status);
      return result.order;
    } catch (error) {
      setOrderError(error.message || 'Не удалось загрузить статус заявки.');
    } finally {
      setStatusLoading(false);
    }
  };

  const loadAdminOrders = async () => {
    setAdminLoading(true);
    try {
      const result = await sendOrderAction('admin_list');
      setAdminOrders(result.orders || []);
      setIsAdmin(true);
      return result.orders || [];
    } catch {
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const updateAdminOrderStatus = async (id, status) => {
    setAdminLoading(true);
    try {
      await sendOrderAction('admin_update_status', {
        orderId: id,
        status,
      });
      await loadAdminOrders();
    } catch (error) {
      alert(error.message || 'Не удалось изменить статус.');
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) loadOrderStatus();
  }, [orderId]);

  useEffect(() => {
    loadAdminOrders();
  }, []);

  const handleCreateOrder = async () => {
    if (isLocalPreview) {
      setOrderError('');
      setOrderStatus('awaiting_payment');
      setPage('Криптооплата');
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const country = countries.find((item) => item.id === selectedCountry);

      const result = await sendOrderAction('create_order', {
        order: {
          crypto: selectedCurrency,
          network: selectedNetwork,
          amount: formatNumber(numericAmount),
          total: formatNumber(totalAmount),
          commission: formatNumber(commissionAmount),
          commissionRate: String(commission),
          country: country.name,
          payoutCurrency,
          paymentMethod,
          bank: selectedBank,
          cardDetails,
          cashCity,
          cashDetails,
        },
      });

      setOrderId(result.orderId);
      localStorage.setItem('kronOrderId', result.orderId);
      setOrderStatus('awaiting_payment');

      if (result.notificationSent === false) {
        setOrderError('Заявка создана, но уведомление менеджеру не доставлено. При необходимости свяжитесь с поддержкой KRON.');
      }

      setPage('Криптооплата');
    } catch (error) {
      setOrderError(error.message || 'Не удалось создать заявку.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleNetworkChange = async (network) => {
    if (network === selectedNetwork || orderLoading) return;

    if (isLocalPreview) {
      setSelectedNetwork(network);
      setOrderError('');
      return;
    }

    if (!orderId) {
      setOrderError('Номер заявки не найден. Вернитесь и создайте заявку заново.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const result = await sendOrderAction('update_network', {
        orderId,
        crypto: selectedCurrency,
        network,
      });
      setSelectedNetwork(network);

      if (result.notificationSent === false) {
        setOrderError('Сеть сохранена, но уведомление не доставлено менеджеру. Свяжитесь с поддержкой KRON.');
      }
    } catch (error) {
      setOrderError(error.message || 'Не удалось изменить сеть оплаты.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleMarkSent = async () => {
    if (isLocalPreview) {
      setOrderError('');
      setOrderStatus('awaiting_review');
      setPage('Статус');
      return;
    }

    if (!orderId) {
      setOrderError('Номер заявки не найден. Вернитесь и создайте заявку заново.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const result = await sendOrderAction('mark_sent', { orderId });
      setOrderStatus('awaiting_review');
      setPage('Статус');

      if (result.notificationSent === false) {
        setOrderError('Заявка сохранена, но уведомление менеджеру не доставлено. Свяжитесь с поддержкой KRON.');
      }

      loadOrderStatus();
    } catch (error) {
      setOrderError(error.message || 'Не удалось отправить уведомление.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <div className="logo">KRON<span>.</span></div>
        <div className="status">ONLINE</div>
      </header>

      {page === 'home' ? (
        <>
          <section className="welcome">
            <p className="eyebrow">ВАША ФИНАНСОВАЯ ПЛАТФОРМА</p>
            <h1>
              Добро пожаловать
              <br />
              в <span>KRON</span>
            </h1>
            <p className="subtitle">
              Управляйте своими операциями в одном месте.
            </p>
          </section>

          <section className="sections">
            <h2>Наши разделы</h2>
            <div className="grid">
              {sections.map((item) => (
                <button
                  className="section-card"
                  key={item.title}
                  onClick={() => setPage(item.title)}
                >
                  <span className="card-icon">{item.icon}</span>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                  <span className="arrow">↗</span>
                </button>
              ))}
            </div>

            {orderId && (
              <button className="primary-button" onClick={() => {
                loadOrderStatus();
                setPage('Статус');
              }}>
                Статус заявки
              </button>
            )}

            {isAdmin && (
              <button className="primary-button" onClick={() => {
                loadAdminOrders();
                setPage('Админ-панель');
              }}>
                Админ-панель
              </button>
            )}
          </section>
        </>
      ) : (
        <section className="inner-page">
          <button
            className="back"
            onClick={() => setPage(
              page === 'Статус' || page === 'Админ-панель' ? 'home' :
              page === 'Криптооплата' ? 'Оплата' :
              page === 'Оплата' ? 'Курс валют' : 'home'
            )}
          >
            ← Назад
          </button>

          <p className="eyebrow">РАЗДЕЛ KRON</p>
          <h1>{page}</h1>

          {page === 'Курс валют' ? (
            <div className="currency-page">
              <div className="currency-list">
                {currencies.map((currency) => (
                  <div className="currency-card" key={currency.id}>
                    <div className="currency-icon">{currency.icon}</div>
                    <div className="currency-info">
                      <strong>
                        {currency.id === 'LOCAL'
                          ? 'Местная валюта'
                          : currency.id}
                      </strong>
                      <small>{currency.name}</small>
                    </div>
                    <div className="currency-details">
                      <div>
                        <small>Курс</small>
                        <strong>{currency.rate}</strong>
                      </div>
                      <div>
                        <small>Комиссия</small>
                        <strong>{currency.commission}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <section className="calculator">
                <div className="calculator-heading">
                  <div>
                    <p className="eyebrow">БЫСТРЫЙ РАСЧЁТ</p>
                    <h2>Калькулятор</h2>
                  </div>
                  <span className="calculator-symbol">⌗</span>
                </div>

                <p className="field-label">Выберите криптовалюту</p>

                <div className="currency-select">
                  {cryptoCurrencies.map((currency) => (
                    <button
                      key={currency.id}
                      className={`currency-option ${
                        selectedCurrency === currency.id ? 'active' : ''
                      }`}
                      onClick={() => {
                        setSelectedCurrency(currency.id);
                        setSelectedNetwork(networksByCrypto[currency.id][0]);
                        setAmount('');
                      }}
                    >
                      {currency.id}
                    </button>
                  ))}
                </div>

                <p className="calculator-note">
                  Лимиты: от {selectedCrypto.limit} до{' '}
                  {formatNumber(selectedCrypto.max)} {selectedCurrency}
                </p>

                <label className="field-label" htmlFor="amount">
                  Сумма
                </label>

                <div className="amount-input-wrap">
                  <input
                    id="amount"
                    type="number"
                    min={selectedCrypto.limit}
                    max={selectedCrypto.max}
                    step="any"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <span>{selectedCurrency}</span>
                </div>

                <p className="field-label">Страна получения</p>
                <select
                  className="payout-select"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <p className="field-label">Валюта получения</p>
                <select
                  className="payout-select"
                  value={payoutCurrency}
                  onChange={(event) => setPayoutCurrency(event.target.value)}
                >
                  <option value="USD">USD — Доллар США</option>
                  <option value="EUR">EUR — Евро</option>
                  <option value={countries.find(c => c.id === selectedCountry).local}>
                    {countries.find(c => c.id === selectedCountry).local} — Местная валюта
                  </option>
                </select>

                <div className="calculation-results">
                  <div className="result-row">
                    <span>Сумма</span>
                    <strong>{formatNumber(numericAmount)} {selectedCurrency}</strong>
                  </div>

                  <div className="result-row">
                    <span>Комиссия ({commission}%)</span>
                    <strong className="commission-value">
                      + {formatNumber(commissionAmount)} {selectedCurrency}
                    </strong>
                  </div>

                  <div className="result-divider" />

                  <div className="result-row total-row">
                    <span>Итого к оплате</span>
                    <strong>
                      {formatNumber(totalAmount)} {selectedCurrency}
                    </strong>
                  </div>

                  <p className="calculator-note">
                    Комиссия зависит от выбранной валюты получения и
                    добавляется к введённой сумме.
                  </p>

                  <button
                    className="primary-button"
                    disabled={numericAmount < selectedCrypto.limit || numericAmount > selectedCrypto.max}
                    onClick={() => {
                      setSelectedBank('');
                      setCardDetails('');
                      setCashCity('');
                      setCashDetails('');
                      setPage('Оплата');
                    }}
                  >
                    Перейти к оплате
                  </button>
                </div>
              </section>
            </div>
          ) : page === 'Оплата' ? (
            <div className="payment-page">
              <p className="field-label">Страна получения</p>
              <div className="payment-summary">
                <strong>{countries.find(c => c.id === selectedCountry).name}</strong>
                <span>{payoutCurrency}</span>
              </div>

              <p className="field-label">Способ получения средств</p>
              <div className="payment-methods">
                {['Visa', 'Mastercard', 'Наличные'].map((method) => (
                  <button
                    key={method}
                    className={`payment-method ${paymentMethod === method ? 'active' : ''}`}
                    onClick={() => {
                      setPaymentMethod(method);
                      setSelectedBank('');
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Наличные' ? (
                <div className="payment-form">
                  <label className="field-label" htmlFor="cash-city">
                    Город получения
                  </label>
                  <input
                    id="cash-city"
                    className="payment-input"
                    placeholder="Введите город"
                    value={cashCity}
                    onChange={(event) => setCashCity(event.target.value)}
                  />

                  <label className="field-label" htmlFor="cash-details">
                    Дополнительная информация
                  </label>
                  <textarea
                    id="cash-details"
                    className="payment-input"
                    placeholder="Удобное время и детали встречи"
                    value={cashDetails}
                    onChange={(event) => setCashDetails(event.target.value)}
                  />
                </div>
              ) : (
                <div className="payment-form">
                  <label className="field-label" htmlFor="payment-bank">
                    Выберите банк
                  </label>
                  <select
                    id="payment-bank"
                    className="payment-input"
                    value={selectedBank}
                    onChange={(event) => setSelectedBank(event.target.value)}
                  >
                    <option value="">Выберите банк</option>
                    {(banksByCountry[selectedCountry] || []).map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>

                  <label className="field-label" htmlFor="card-details">
                    Номер карты или IBAN
                  </label>
                  <input
                    id="card-details"
                    className="payment-input"
                    placeholder="Введите реквизиты"
                    value={cardDetails}
                    onChange={(event) => setCardDetails(event.target.value)}
                  />
                </div>
              )}

              <div className="calculation-results">
                <div className="result-row">
                  <span>Сумма</span>
                  <strong>{formatNumber(numericAmount)} {selectedCurrency}</strong>
                </div>
                <div className="result-row">
                  <span>Комиссия ({commission}%)</span>
                  <strong className="commission-value">
                    + {formatNumber(commissionAmount)} {selectedCurrency}
                  </strong>
                </div>
                <div className="result-divider" />
                <div className="result-row total-row">
                  <span>Итого к оплате</span>
                  <strong>{formatNumber(totalAmount)} {selectedCurrency}</strong>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={handleCreateOrder}
                disabled={
                  orderLoading ||
                  (paymentMethod === 'Наличные'
                    ? !cashCity.trim()
                    : !selectedBank || !cardDetails.trim())
                }
              >
                {orderLoading ? 'Создаём заявку...' : 'Продолжить'}
              </button>
              {orderError && <p className="calculator-note">{orderError}</p>}
            </div>
          ) : page === 'Криптооплата' ? (
            <div className="payment-page">
              <p className="field-label">Сумма к оплате</p>
              <div className="payment-summary">
                <strong>{formatNumber(totalAmount)} {selectedCurrency}</strong>
                <span>{selectedNetwork}</span>
              </div>

              <p className="field-label">Выберите сеть перевода</p>
              <div className="payment-methods">
                {networksByCrypto[selectedCurrency].map((network) => (
                  <button
                    key={network}
                    className={`payment-method ${selectedNetwork === network ? 'active' : ''}`}
                    onClick={() => handleNetworkChange(network)}
                    disabled={orderLoading}
                  >
                    {network}
                  </button>
                ))}
              </div>

              <p className="field-label">Адрес для перевода</p>
              <div className="payment-summary address-summary">
                <strong>{addressesByCrypto[selectedCurrency][selectedNetwork]}</strong>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    addressesByCrypto[selectedCurrency][selectedNetwork]
                  );
                  alert('Адрес скопирован');
                }}
              >
                Скопировать адрес
              </button>

              <p className="field-label">Откройте свой кошелёк</p>
              <div className="wallet-grid">
                {wallets.map((wallet) => {
                  const WalletIcon = wallet.icon;
                  return (
                    <button
                      key={wallet.id}
                      type="button"
                      className="wallet-button"
                      onClick={() => window.open(wallet.url, '_blank', 'noopener,noreferrer')}
                    >
                      <span className="wallet-button-main">
                        <WalletIcon size={30} variant="branded" />
                        <span className="wallet-button-name">{wallet.name}</span>
                      </span>
                      <span className="wallet-button-arrow">↗</span>
                    </button>
                  );
                })}
              </div>
              <p className="calculator-note">
                После открытия приложения выберите отправку средств, укажите
                нужную монету и сеть, затем вставьте скопированный адрес и сумму.
                Перед подтверждением внимательно проверьте реквизиты.
              </p>

              <div className="calculator-note">
                Внимание! Отправляйте только {selectedCurrency} по сети {selectedNetwork}.
                Перевод через другую сеть может привести к потере средств.
                Перед отправкой обязательно проверьте адрес.
              </div>

              <button
                className="primary-button"
                onClick={handleMarkSent}
                disabled={orderLoading}
              >
                {orderLoading ? 'Отправляем...' : 'Я отправил средства'}
              </button>
              {orderError && <p className="calculator-note">{orderError}</p>}
            </div>
          ) : page === 'Статус' ? (
            <div className="payment-page">
              <div className="status-panel">
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <h2>
                    {{
                      awaiting_payment: 'Ожидает оплаты',
                      awaiting_review: 'Ожидает проверки менеджером',
                      confirmed: 'Заявка подтверждена',
                    }[orderStatus] || 'Загрузка статуса...'}
                  </h2>
                </div>

                <p className="status-message">
                  {orderStatus === 'awaiting_payment'
                    ? 'Ожидаем отправку средств. После перевода нажмите «Я отправил средства».'
                    : orderStatus === 'awaiting_review'
                      ? 'Ваш запрос отправлен на проверку менеджеру. Как только средства поступят на счёт, заявка будет обработана. Пожалуйста, ожидайте.'
                      : orderStatus === 'confirmed'
                        ? 'Средства получены. Ваша заявка подтверждена менеджером.'
                        : 'Проверяем информацию о вашей заявке.'}
                </p>

                <p className="status-order-id">Номер заявки: {orderId}</p>

                <button
                  className="primary-button status-refresh"
                  onClick={loadOrderStatus}
                  disabled={statusLoading}
                >
                  {statusLoading ? 'Обновляем...' : 'Обновить статус'}
                </button>

                {orderError && <p className="status-message">{orderError}</p>}
              </div>
            </div>
          ) : page === 'Админ-панель' && isAdmin ? (
            <div className="payment-page">
              <h2 className="admin-heading">Управление заявками</h2>

              <button
                className="primary-button"
                onClick={loadAdminOrders}
                disabled={adminLoading}
              >
                {adminLoading ? 'Загрузка...' : 'Обновить список'}
              </button>

              {adminOrders.length === 0 ? (
                <p className="admin-empty">Заявок пока нет.</p>
              ) : adminOrders.map((order) => (
                <div className="admin-order" key={order.id}>
                  <h3>Заявка {order.id}</h3>
                  <p><strong>Статус:</strong> {{
                    awaiting_payment: 'Ожидает оплаты',
                    awaiting_review: 'Ожидает проверки менеджером',
                    confirmed: 'Подтверждена',
                  }[order.status] || order.status}</p>
                  <p><strong>Telegram ID:</strong> {order.user_id}</p>
                  <p><strong>Криптовалюта:</strong> {order.order_data?.crypto}</p>
                  <p><strong>Сеть:</strong> {order.order_data?.network}</p>
                  <p><strong>Сумма:</strong> {order.order_data?.amount}</p>
                  <p><strong>К выплате:</strong> {order.order_data?.total}</p>
                  <p><strong>Страна:</strong> {order.order_data?.country}</p>
                  <p><strong>Способ выплаты:</strong> {order.order_data?.paymentMethod}</p>
                  <p><strong>Банк:</strong> {order.order_data?.bank || 'Не указан'}</p>
                  <p><strong>Реквизиты:</strong> {order.order_data?.cardDetails || order.order_data?.cashDetails || 'Не указаны'}</p>

                  <div className="admin-actions">
                    {order.status === 'awaiting_review' && (
                      <button
                        className="primary-button"
                        onClick={() => updateAdminOrderStatus(order.id, 'confirmed')}
                        disabled={adminLoading}
                      >
                        Подтвердить
                      </button>
                    )}
                    {order.status === 'awaiting_payment' && (
                      <button
                        className="primary-button"
                        onClick={() => updateAdminOrderStatus(order.id, 'awaiting_review')}
                        disabled={adminLoading}
                      >
                        На проверку
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="subtitle">Раздел скоро будет доступен.</p>
          )}
        </section>
      )}

      <footer>KRON © 2026 · ALL RIGHTS RESERVED</footer>
    </main>
  );
}

export default App;
