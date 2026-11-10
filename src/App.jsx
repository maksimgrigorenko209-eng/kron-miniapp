import { useState, useEffect } from 'react';
import './App.css';

function App() {
const [page, setPage] = useState('home');
useEffect(() => {
const tg = window.Telegram?.WebApp;

if (!tg) return;

tg.ready();
tg.expand();}, []);

const sections = [
{ icon: '💱', title: 'Курс валют', desc: 'Актуальные курсы валют' },
{ icon: '🔄', title: 'Обмен', desc: 'Обменные операции' },
{ icon: '🎁', title: 'Предложения', desc: 'Специальные предложения' },
{ icon: '🎧', title: 'Поддержка', desc: 'Связь с менеджером' },
];

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
        <h1>Добро пожаловать<br />в <span>KRON</span></h1>
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
        <div className="currency-list">
          <div className="currency-card">🇺🇸 <strong>Доллар США</strong></div>
          <div className="currency-card">🇪🇺 <strong>Евро</strong></div>
          <div className="currency-card">💱 <strong>Местная валюта</strong><small>Уточнять у менеджера</small></div>
        </div>
      ) : (
        <p className="subtitle">Раздел скоро будет доступен.</p>
      )}
    </section>
  )}

  <footer>KRON © 2026 · ALL RIGHTS RESERVED</footer>
</main>);
}

export default App;