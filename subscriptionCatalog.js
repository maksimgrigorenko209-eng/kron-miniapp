export const subscriptionGroups = [
  {
    id: 'ai',
    title: 'ИИ и нейросети',
    services: [
      { id: 'chatgpt', name: 'ChatGPT', plans: [
        { id: 'plus', name: 'Plus', kron: 14, official: 20 },
        { id: 'pro-100', name: 'Pro 100', kron: 70, official: 100 },
        { id: 'pro-200', name: 'Pro 200', kron: 140, official: 200 },
        { id: 'pro-500', name: 'Pro 500', kron: 350, official: 500 },
      ]},
      { id: 'claude', name: 'Claude', plans: [
        { id: 'pro-monthly', name: 'Pro — ежемесячно', kron: 14, official: 20 },
        { id: 'pro-annual', name: 'Pro — годовая оплата', kron: 142.80, official: 204, annual: true, monthlyKron: 11.90, monthlyOfficial: 17 },
        { id: 'max-5x', name: 'Max 5x', kron: 70, official: 100 },
        { id: 'max-20x', name: 'Max 20x', kron: 140, official: 200 },
      ]},
      { id: 'google-ai', name: 'Google AI Pro', plans: [
        { id: 'pro', name: 'AI Pro', kron: 13.99, official: 19.99 },
      ]},
      { id: 'midjourney', name: 'Midjourney', plans: [
        { id: 'basic', name: 'Basic', kron: 7, official: 10 },
        { id: 'standard', name: 'Standard', kron: 21, official: 30 },
        { id: 'pro', name: 'Pro', kron: 42, official: 60 },
        { id: 'mega', name: 'Mega', kron: 84, official: 120 },
      ]},
      { id: 'perplexity', name: 'Perplexity', plans: [
        { id: 'pro-annual', name: 'Pro — годовая оплата', kron: 142.80, official: 204, annual: true, monthlyKron: 11.90, monthlyOfficial: 17 },
        { id: 'max-annual', name: 'Max — годовая оплата', kron: 1402.80, official: 2004, annual: true, monthlyKron: 116.90, monthlyOfficial: 167 },
      ]},
      { id: 'grok', name: 'Grok / X', plans: [
        { id: 'premium', name: 'Premium', kron: 21, official: 30 },
        { id: 'super', name: 'Super', kron: 70, official: 100 },
        { id: 'ultra', name: 'Ultra', kron: 140, official: 200 },
      ]},
      { id: 'cursor', name: 'Cursor', plans: [
        { id: 'pro', name: 'Pro', kron: 14, official: 20, provisional: true },
      ]},
      { id: 'elevenlabs', name: 'ElevenLabs', plans: [
        { id: 'starter', name: 'Starter', kron: 4.20, official: 6 },
        { id: 'creator', name: 'Creator', kron: 15.40, official: 22 },
        { id: 'pro', name: 'Pro', kron: 69.30, official: 99 },
      ]},
    ],
  },
  {
    id: 'video',
    title: 'Фильмы и сериалы',
    services: [
      { id: 'netflix', name: 'Netflix', plans: [
        { id: 'standard-ads', name: 'Standard с рекламой', kron: 6.29, official: 8.99 },
        { id: 'standard', name: 'Standard', kron: 13.99, official: 19.99 },
        { id: 'premium', name: 'Premium', kron: 18.89, official: 26.99 },
      ]},
      { id: 'disney', name: 'Disney+', plans: [
        { id: 'with-ads', name: 'С рекламой', kron: 8.74, official: 12.49 },
        { id: 'premium', name: 'Premium', kron: 15.04, official: 21.49 },
      ]},
      { id: 'prime-video', name: 'Prime Video', plans: [
        { id: 'standard', name: 'Prime Video', kron: 6.29, official: 8.99, provisional: true },
      ]},
      { id: 'hbo', name: 'HBO Max', plans: [
        { id: 'basic', name: 'Basic с рекламой', kron: 7.69, official: 10.99 },
        { id: 'standard', name: 'Standard', kron: 12.94, official: 18.49 },
        { id: 'premium', name: 'Premium', kron: 16.09, official: 22.99, provisional: true },
      ]},
      { id: 'apple-tv', name: 'Apple TV+', plans: [
        { id: 'standard', name: 'Apple TV+', kron: 9.09, official: 12.99, provisional: true },
      ]},
      { id: 'crunchyroll', name: 'Crunchyroll', plans: [
        { id: 'fan', name: 'Fan', kron: 6.99, official: 9.99 },
        { id: 'mega-fan', name: 'Mega Fan', kron: 9.79, official: 13.99 },
        { id: 'ultimate-fan', name: 'Ultimate Fan', kron: 12.59, official: 17.99 },
      ]},
    ],
  },
  {
    id: 'music',
    title: 'Музыка',
    services: [
      { id: 'spotify', name: 'Spotify Premium', plans: [
        { id: 'individual', name: 'Individual', kron: 9.09, official: 12.99 },
        { id: 'family', name: 'Family', kron: 15.39, official: 21.99 },
      ]},
      { id: 'youtube-premium', name: 'YouTube Premium', plans: [
        { id: 'individual', name: 'Individual', kron: 9.79, official: 13.99 },
      ]},
      { id: 'youtube-music', name: 'YouTube Music', plans: [
        { id: 'individual', name: 'Individual', kron: 8.39, official: 11.99, provisional: true },
      ]},
      { id: 'apple-music', name: 'Apple Music', plans: [
        { id: 'individual', name: 'Individual', kron: 8.39, official: 11.99 },
      ]},
      { id: 'deezer', name: 'Deezer', plans: [
        { id: 'premium', name: 'Premium', kron: 8.39, official: 11.99, provisional: true },
      ]},
      { id: 'tidal', name: 'Tidal', plans: [
        { id: 'individual', name: 'Individual', kron: 8.39, official: 11.99 },
      ]},
    ],
  },
  {
    id: 'work',
    title: 'Работа и продуктивность',
    services: [
      { id: 'microsoft-365', name: 'Microsoft 365', plans: [
        { id: 'personal', name: 'Personal', kron: 6.99, official: 9.99 },
      ]},
      { id: 'canva', name: 'Canva Pro', plans: [
        { id: 'annual', name: 'Pro — годовая оплата', kron: 100.80, official: 144, annual: true, monthlyKron: 8.40, monthlyOfficial: 12 },
      ]},
      { id: 'adobe', name: 'Adobe Creative Cloud', plans: [
        { id: 'pro', name: 'Creative Cloud Pro', kron: 48.99, official: 69.99, provisional: true },
      ]},
      { id: 'notion', name: 'Notion Plus', plans: [
        { id: 'plus', name: 'Plus', kron: 7, official: 10 },
      ]},
      { id: 'grammarly', name: 'Grammarly Pro', plans: [
        { id: 'monthly', name: 'Pro — ежемесячно', kron: 21, official: 30 },
        { id: 'annual', name: 'Pro — годовая оплата', kron: 100.80, official: 144, annual: true, monthlyKron: 8.40, monthlyOfficial: 12 },
      ]},
      { id: 'zoom', name: 'Zoom Pro', plans: [
        { id: 'workplace-pro', name: 'Workplace Pro', kron: 11.89, official: 16.99 },
      ]},
      { id: 'github-copilot', name: 'GitHub Copilot', plans: [
        { id: 'pro', name: 'Pro', kron: 7, official: 10 },
      ]},
    ],
  },
  {
    id: 'cloud',
    title: 'Облачные хранилища',
    services: [
      { id: 'icloud', name: 'iCloud+', plans: [
        { id: '50gb', name: '50 GB', kron: 0.69, official: 0.99 },
        { id: '200gb', name: '200 GB', kron: 2.09, official: 2.99 },
        { id: '2tb', name: '2 TB', kron: 6.99, official: 9.99 },
      ]},
      { id: 'google-one', name: 'Google One', plans: [
        { id: 'basic-100gb', name: 'Basic — 100 GB', kron: 1.39, official: 1.99 },
        { id: 'ai-pro-5tb', name: 'AI Pro — 5 TB', kron: 13.99, official: 19.99 },
      ]},
      { id: 'dropbox', name: 'Dropbox', plans: [
        { id: 'plus-2tb', name: 'Plus — 2 TB', kron: 6.99, official: 9.99 },
      ]},
      { id: 'mega', name: 'MEGA', plans: [
        { id: 'pro-i', name: 'Pro I', kron: 6.99, official: 9.99, provisional: true },
      ]},
      { id: 'onedrive', name: 'OneDrive', plans: [
        { id: '100gb', name: '100 GB', kron: 1.39, official: 1.99, provisional: true },
      ]},
      { id: 'pcloud', name: 'pCloud', plans: [
        { id: '500gb', name: '500 GB', kron: 3.49, official: 4.99, provisional: true },
        { id: '2tb', name: '2 TB', kron: 6.99, official: 9.99, provisional: true },
      ]},
    ],
  },
  {
    id: 'security',
    title: 'VPN и безопасность',
    services: [
      { id: 'nordvpn', name: 'NordVPN', plans: [
        { id: 'basic-monthly', name: 'Basic — ежемесячно', kron: 10.49, official: 14.99 },
      ]},
      { id: 'surfshark', name: 'Surfshark', plans: [
        { id: 'starter', name: 'Starter', kron: 10.82, official: 15.45, provisional: true },
      ]},
      { id: 'expressvpn', name: 'ExpressVPN', plans: [
        { id: 'basic', name: 'Basic', kron: 9.09, official: 12.99, provisional: true },
      ]},
      { id: 'proton-vpn', name: 'Proton VPN', plans: [
        { id: 'plus', name: 'Plus', kron: 6.99, official: 9.99 },
      ]},
      { id: '1password', name: '1Password', plans: [
        { id: 'individual-annual', name: 'Individual — годовая оплата', kron: 33.52, official: 47.88, annual: true, monthlyKron: 2.79, monthlyOfficial: 3.99 },
      ]},
    ],
  },
];

export function findSubscriptionPlan(serviceId, planId) {
  for (const group of subscriptionGroups) {
    const service = group.services.find((item) => item.id === serviceId);
    if (service) {
      const plan = service.plans.find((item) => item.id === planId);
      return plan ? { group, service, plan } : null;
    }
  }
  return null;
}
