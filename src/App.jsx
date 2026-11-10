
import { useState, useEffect } from 'react';
import './App.css';

const currencies = [
  { id: 'USDT', name: 'Tether', rate: '1 / 1', commission: 4, icon: '₮' },
  { id: 'USD', name: 'Доллар США', rate: '1 / 1', commission: 4, icon: '$' },
  { id: 'EUR', name: 'Евро', rate: '1 / 1', commission: 5, icon: '€' },
  { id: 'LOCAL', name: 'Местная валюта', rate: 'У менеджера', commission: 2, icon: '₽' },
];

function App() {
  const [page, setPage] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');

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

  const currentCurrency = currencies.find(
    (currency) => currency.id === selectedCurrency
  );

  const numericAmount = Math.max(0, Number(amount) || 0);
  const commissionAmount =
    numericAmount * (currentCurrency.commission / 100);
  const totalAmount = numericAmount + commissionAmount;

  const formatNumber = (value) =>
    new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 2,
    }).format(value);

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
          </section>
        </>
      ) : (
        <section className="inner-page">
          <button className="back" onClick={() => setPage('home')}>
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
                      <strong>{currency.id === 'LOCAL' ? 'Местная валюта' : currency.id}</strong>
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

                <p className="field-label">Выберите валюту</p>

                <div className="currency-select">
                  {currencies.map((currency) => (
                    <button
                      key={currency.id}
                      className={`currency-option ${
                        selectedCurrency === currency.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCurrency(currency.id)}
                    >
                      {currency.id === 'LOCAL' ? 'Местная' : currency.id}
                    </button>
                  ))}
                </div>

                <label className="field-label" htmlFor="amount">
                  Сумма
                </label>

                <div className="amount-input-wrap">
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <span>{selectedCurrency === 'LOCAL' ? 'Местная' : selectedCurrency}</span>
                </div>

                <div className="calculation-results">
                  <div className="result-row">
                    <span>Сумма</span>
                    <strong>{formatNumber(numericAmount)}</strong>
                  </div>

                  <div className="result-row">
                    <span>Комиссия ({currentCurrency.commission}%)</span>
                    <strong className="commission-value">
                      + {formatNumber(commissionAmount)}
                    </strong>
                  </div>

                  <div className="result-divider" />

                  <div className="result-row total-row">
                    <span>Итого к оплате</span>
                    <strong>{formatNumber(totalAmount)}</strong>
                  </div>

                  <p className="calculator-note">
                    Комиссия добавляется к введённой сумме.
                  </p>
                </div>
              </section>
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

