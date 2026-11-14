export const gameCatalog = {
  'pubg-mobile': {
    categories: [
      { name: 'Игровая валюта', products: [
        [60,0.97],[120,1.95],[180,2.98],[325,4.86],[385,5.82],
        [660,10.99],[720,10.68],[985,14.55],[1320,19.40,true],
        [1800,26.99],[2125,28.99],[2460,30.99],[3850,54.99],
        [4510,58.22,false,false],[5650,69.99],[8100,104.99],
        [9900,119.99,true],[11950,135.50],[16200,180.96],
        [24300,199.99],[32400,399.99,false,false],[40500,449.99],
        [48600,519.99],[81000,899.99,false,false],
      ].map(([amount, price, popular, available]) => ({
        id: `uc-${amount}`, name: `${amount.toLocaleString('en-US')} UC`,
        price, popular: Boolean(popular), available: available !== false,
      })) },
      { name: 'Пропуски', products: [
        { id:'rp-1-50', name:'Обычный Royal Pass · уровни 1–50', price:5.55 },
        { id:'rp-1-100', name:'Обычный Royal Pass · уровни 1–100', price:10.68 },
        { id:'rp-upgraded-1-100', name:'Улучшенный Royal Pass · уровни 1–100', price:28.00 },
      ] },
    ],
    accountFields: [{ key:'playerId', label:'PUBG Mobile Player ID', placeholder:'Введите игровой ID', required:true }],
  },

  'free-fire': {
    categories: [{ name:'Игровая валюта', products:[
      {id:'ff-100',name:'100 алмазов',price:0.99},
      {id:'ff-310',name:'310 алмазов',price:2.99},
      {id:'ff-520',name:'520 алмазов',price:1.99},
      {id:'ff-1060',name:'1 060 алмазов',price:6.99},
      {id:'ff-2180',name:'2 180 алмазов',price:16.99},
      {id:'ff-5600',name:'5 600 алмазов',price:46.99},
    ]}],
    accountFields:[{key:'playerId',label:'Free Fire Player ID',placeholder:'Введите игровой ID',required:true}],
  },

  'mobile-legends': {
    categories:[{name:'Игровая валюта',products:[
      {id:'ml-100',name:'100 алмазов',price:0.99},
      {id:'ml-300',name:'300 алмазов',price:2.99},
      {id:'ml-500',name:'500 алмазов',price:2.99},
      {id:'ml-1000',name:'1 000 алмазов',price:6.99},
      {id:'ml-1160',name:'1 160 алмазов',price:16.99},
      {id:'ml-1770',name:'1 770 алмазов',price:26.99},
      {id:'ml-2975',name:'2 975 алмазов',price:46.99},
      {id:'ml-4165',name:'4 165 алмазов',price:66.99},
      {id:'ml-6000',name:'6 000 алмазов',price:96.99},
    ]}],
    accountFields:[
      {key:'userId',label:'User ID',placeholder:'Введите User ID',required:true},
      {key:'zoneId',label:'Zone ID',placeholder:'Введите Zone ID',required:true},
    ],
  },

  'roblox': {
    categories:[{name:'Наборы и предложения',products:[
      {id:'roblox-10',name:'Подарочная карта Roblox $10',price:10},
      {id:'roblox-25',name:'Подарочная карта Roblox $25',price:25},
      {id:'roblox-50',name:'Подарочная карта Roblox $50',price:50},
      {id:'roblox-100',name:'Подарочная карта Roblox $100',price:100},
    ]}],
    accountFields:[{key:'username',label:'Roblox username',placeholder:'Введите имя пользователя Roblox',required:true}],
    fulfillmentNote:'Robux выдаются через подарочную карту Roblox. Заказ обрабатывается менеджером вручную.',
  },

  'standoff-2': {
    categories:[{name:'Игровая валюта',products:[
      {id:'standoff-100',name:'100 Gold',price:1.99},
      {id:'standoff-500',name:'500 Gold',price:5.49},
      {id:'standoff-1000',name:'1 000 Gold',price:11.99},
      {id:'standoff-3000',name:'3 000 Gold',price:31.99},
    ]}],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },

  'brawl-stars': {
    categories:[
      {name:'Игровая валюта',products:[
        {id:'brawl-80',name:'80 гемов',price:3.00},
        {id:'brawl-170',name:'170 гемов',price:5.00},
        {id:'brawl-360',name:'360 гемов',price:10.00},
        {id:'brawl-950',name:'950 гемов',price:28.99},
        {id:'brawl-2000',name:'2 000 гемов',price:59.99},
      ]},
      {name:'Пропуски',products:[
        {id:'brawl-pass',name:'Обычный Brawl Pass',price:4.99},
        {id:'brawl-pass-plus',name:'Brawl Pass Plus',price:5.99},
      ]},
    ],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },

  'call-of-duty-mobile': {
    categories:[{name:'Игровая валюта',products:[
      {id:'cod-88',name:'88 CP',price:0.99},
      {id:'cod-160',name:'160 CP',price:2.68},
      {id:'cod-460',name:'460 CP',price:0.24},
      {id:'cod-960',name:'960 CP',price:3.49},
      {id:'cod-2600',name:'2 600 CP',price:13.24},
      {id:'cod-5400',name:'5 400 CP',price:29.49},
      {id:'cod-11600',name:'11 600 CP',price:96.99},
    ]}],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },

  'genshin-impact': {
    categories:[
      {name:'Игровая валюта',products:[
        {id:'genshin-60',name:'60 кристаллов',price:0.99},
        {id:'genshin-300',name:'300 + 30 кристаллов',price:1.99},
        {id:'genshin-980',name:'980 + 110 кристаллов',price:11.99},
        {id:'genshin-1980',name:'1 980 + 260 кристаллов',price:26.99},
        {id:'genshin-3280',name:'3 280 + 600 кристаллов',price:46.99},
        {id:'genshin-6480',name:'6 480 + 1 600 кристаллов',price:96.99},
      ]},
      {name:'Пропуски',products:[
        {id:'genshin-welkin',name:'Благословение полой луны',price:1.99},
        {id:'genshin-hymn',name:'Боевой пропуск Gnostic Hymn',price:6.99},
      ]},
    ],
    accountFields:[
      {key:'uid',label:'UID',placeholder:'Введите UID',required:true},
      {key:'server',label:'Сервер',placeholder:'Выберите или укажите сервер',required:true},
    ],
  },

  'clash-of-clans': {
    categories:[{name:'Игровая валюта',products:[
      {id:'coc-80',name:'80 гемов',price:0.99},
      {id:'coc-500',name:'500 гемов',price:1.99},
      {id:'coc-1200',name:'1 200 гемов',price:6.99},
      {id:'coc-2500',name:'2 500 гемов',price:16.99},
      {id:'coc-6500',name:'6 500 гемов',price:46.99},
      {id:'coc-14000',name:'14 000 гемов',price:96.99},
    ]}],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },

  'ea-sports-fc-mobile': {
    categories:[{name:'Игровая валюта',products:[
      {id:'fc-40',name:'40 FC Points',price:0.39},
      {id:'fc-100',name:'100 FC Points',price:0.99},
      {id:'fc-520',name:'520 FC Points',price:1.99},
      {id:'fc-1070',name:'1 070 FC Points',price:6.99},
      {id:'fc-2200',name:'2 200 FC Points',price:16.99},
      {id:'fc-5750',name:'5 750 FC Points',price:46.99},
      {id:'fc-12000',name:'12 000 FC Points',price:96.99},
    ]}],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },

  'honkai-star-rail': {
    categories:[
      {name:'Игровая валюта',products:[
        {id:'hsr-60',name:'60 Oneiric Shards',price:0.99},
        {id:'hsr-300',name:'300 + 30 Oneiric Shards',price:1.99},
        {id:'hsr-980',name:'980 + 110 Oneiric Shards',price:11.99},
        {id:'hsr-1980',name:'1 980 + 260 Oneiric Shards',price:26.99},
        {id:'hsr-3280',name:'3 280 + 600 Oneiric Shards',price:46.99},
        {id:'hsr-6480',name:'6 480 + 1 600 Oneiric Shards',price:96.99},
      ]},
      {name:'Пропуски',products:[
        {id:'hsr-pass',name:'Express Supply Pass',price:1.99},
      ]},
    ],
    accountFields:[
      {key:'uid',label:'UID',placeholder:'Введите UID',required:true},
      {key:'server',label:'Сервер',placeholder:'Выберите или укажите сервер',required:true},
    ],
  },

  'arena-breakout': {
    categories:[{name:'Игровая валюта',products:[
      {id:'arena-66',name:'66 Bonds',price:0.83},
      {id:'arena-335',name:'335 Bonds',price:1.19},
      {id:'arena-675',name:'675 Bonds',price:5.39},
      {id:'arena-1690',name:'1 690 Bonds',price:17.97},
      {id:'arena-3400',name:'3 400 Bonds',price:39.02},
      {id:'arena-6820',name:'6 820 Bonds',price:80.90},
      {id:'arena-13640',name:'13 640 Bonds',price:164.79},
      {id:'arena-20460',name:'20 460 Bonds',price:248.69},
    ]}],
    accountFields:[],
    fulfillmentNote:'После оформления менеджер уточнит необходимые данные аккаунта.',
  },
};


// KRON_PRICE_ADJUSTMENT
for (const game of Object.values(gameCatalog)) {
  for (const category of game.categories) {
    for (const product of category.products) {
      product.price = Number((product.price * 0.70).toFixed(2));
    }
  }
}


export function findGameProduct(gameId, category, productId) {
  const game = gameCatalog[gameId];
  const group = game?.categories.find((item) => item.name === category);
  return group?.products.find((item) => item.id === productId) || null;
}
