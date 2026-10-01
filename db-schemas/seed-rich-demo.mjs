// Rich demo seed — re-runnable, cleans previous demo rows first.
// Run from monorepo root:  node db-schemas/seed-rich-demo.mjs
// Demo logins: demo01@restart.app … demo30@restart.app  /  password: Demo1234!

import bcrypt from 'bcrypt';
import { makeDatasource } from '@restart/datasource';
import { makeDatasourceConfig } from '@restart/config';

const { query, pool } = makeDatasource(makeDatasourceConfig());
const rnd  = (a, b)  => Math.floor(Math.random() * (b - a + 1)) + a;
const pick  = (arr)   => arr[rnd(0, arr.length - 1)];
const pickN = (arr,n) => arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
const ago   = (days)  => new Date(Date.now() - Math.random() * days * 86400000).toISOString();
const round50 = (n)   => Math.round(n / 50) * 50;

// ──────────────────────────────────────────────
// DATA TABLES
// ──────────────────────────────────────────────

const NAMES = [
  'Ayşe Demir','Mehmet Kaya','Zeynep Yılmaz','Ali Çelik','Elif Şahin',
  'Burak Arslan','Selin Aydın','Can Öztürk','Deniz Koç','Merve Polat',
  'Emre Güneş','Ceren Aksoy','Berk Doğan','İpek Taş','Tarık Erdoğan',
  'Naz Yıldız','Oğuz Kurt','Simge Kaplan','Fatih Şimşek','Dilara Aydın',
  'Mert Tunç','Ece Bulut','Yasin Özdemir','Hande Kara','Volkan Sarı',
  'Pınar Çetin','Umut Duman','Gamze Yıldırım','Selim Aktaş','Beyza Güler',
];

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
];

// Multiple real Unsplash photos per category
const IMGS = {
  phone: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&q=80',
    'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=600&q=80',
  ],
  accessory: [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    'https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=600&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
  ],
  camera: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80',
    'https://images.unsplash.com/photo-1540560125640-a4a68bfe37e2?w=600&q=80',
  ],
  console: [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
    'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600&q=80',
  ],
};

const CATALOG = {
  phone: [
    ['iPhone 15 Pro 256GB', 52000, 62000],
    ['iPhone 14 128GB', 38000, 46000],
    ['iPhone 13 128GB', 26000, 33000],
    ['iPhone 12 64GB', 17000, 23000],
    ['iPhone SE (2022) 64GB', 14000, 18000],
    ['Samsung Galaxy S24', 42000, 52000],
    ['Samsung Galaxy S23 Ultra', 38000, 48000],
    ['Samsung Galaxy A54 5G', 16000, 21000],
    ['Samsung Galaxy A35', 11000, 15000],
    ['Xiaomi 14 Pro', 35000, 42000],
    ['Xiaomi 13T 256GB', 18000, 24000],
    ['Xiaomi Redmi Note 13 Pro', 12000, 16000],
    ['Google Pixel 8 Pro', 38000, 46000],
    ['OnePlus 12 256GB', 28000, 35000],
    ['Huawei P60 Pro', 25000, 32000],
  ],
  laptop: [
    ['MacBook Pro 14" M3', 72000, 85000],
    ['MacBook Air 15" M2', 55000, 65000],
    ['MacBook Air 13" M1', 38000, 46000],
    ['Dell XPS 15 OLED', 55000, 68000],
    ['Dell XPS 13 Plus', 42000, 52000],
    ['Lenovo ThinkPad X1 Carbon', 50000, 62000],
    ['Lenovo ThinkPad T14 Gen 3', 28000, 36000],
    ['HP Spectre x360 14', 45000, 55000],
    ['HP Pavilion 15 i5', 18000, 24000],
    ['ASUS ZenBook Pro 16X', 48000, 58000],
    ['ASUS ROG Zephyrus G14', 52000, 64000],
    ['MSI Stealth 16 Studio', 65000, 78000],
    ['Acer Swift 3 i7', 22000, 29000],
    ['Huawei MateBook X Pro', 38000, 48000],
  ],
  tablet: [
    ['iPad Pro 12.9" M2 256GB', 42000, 52000],
    ['iPad Air 5 64GB', 22000, 28000],
    ['iPad 10. Nesil 64GB', 14000, 19000],
    ['iPad mini 6 64GB', 16000, 21000],
    ['Samsung Galaxy Tab S9+', 35000, 44000],
    ['Samsung Galaxy Tab S8', 22000, 29000],
    ['Samsung Galaxy Tab A9+', 10000, 14000],
    ['Lenovo Tab P12 Pro', 14000, 19000],
    ['Xiaomi Pad 6 Pro', 12000, 16000],
  ],
  accessory: [
    ['AirPods Pro (2. Nesil)', 8000, 11000],
    ['AirPods Max', 12000, 16000],
    ['Apple Watch Series 9 45mm', 16000, 21000],
    ['Apple Watch SE 2 44mm', 8000, 12000],
    ['Sony WH-1000XM5', 8000, 11000],
    ['Sony WF-1000XM5', 6000, 9000],
    ['Bose QuietComfort 45', 7000, 10000],
    ['Samsung Galaxy Buds2 Pro', 5000, 8000],
    ['Samsung Galaxy Watch 6 Classic', 9000, 13000],
    ['Logitech MX Master 3S', 3000, 5000],
    ['Keychron K2 Mekanik Klavye', 2500, 4000],
    ['Anker Prime 27650mAh Power Bank', 2000, 3500],
    ['Belkin MagSafe 3-in-1 Şarj', 2500, 4000],
    ['Jabra Evolve2 85 Kulaklık', 8000, 12000],
  ],
  camera: [
    ['Sony Alpha 7 IV Body', 68000, 82000],
    ['Canon EOS R6 Mark II', 62000, 75000],
    ['Nikon Z6 II Body', 52000, 64000],
    ['Fujifilm X-T5', 42000, 52000],
    ['Sony ZV-E10 Kit', 18000, 24000],
    ['GoPro Hero 12 Black', 8000, 12000],
    ['DJI Osmo Pocket 3', 7000, 11000],
  ],
  console: [
    ['PlayStation 5 Dijital', 22000, 28000],
    ['PlayStation 5 Diskli', 25000, 32000],
    ['Xbox Series X', 22000, 28000],
    ['Nintendo Switch OLED', 14000, 19000],
    ['Steam Deck 512GB OLED', 18000, 24000],
  ],
};

const CITIES = [
  'Kadıköy, İstanbul',    'Beşiktaş, İstanbul',  'Üsküdar, İstanbul',
  'Şişli, İstanbul',      'Maltepe, İstanbul',    'Ataşehir, İstanbul',
  'Çankaya, Ankara',      'Keçiören, Ankara',     'Yenimahalle, Ankara',
  'Karşıyaka, İzmir',     'Bornova, İzmir',       'Konak, İzmir',
  'Nilüfer, Bursa',       'Osmangazi, Bursa',     'Muratpaşa, Antalya',
  'Kepez, Antalya',       'Mezitli, Mersin',      'Seyhan, Adana',
  'Çukurova, Adana',      'Odunpazarı, Eskişehir',
];

const CONDITIONS = [
  'Temiz kullanılmış, orijinal kutusuyla birlikte.',
  'Faturalı ürün, garantisi devam ediyor. Hiç hasar yok.',
  'Ekranında ve kasasında hiçbir çizik yok, orijinal şarj aleti dahil.',
  'Batarya sağlığı %92, bakımlı ve kılıfla birlikte satılıyor.',
  'Az kullanıldı. Orijinal ambalajında, tüm aksesuarlar mevcut.',
  'Spot ürün, TR garantili. Düşük km. Çok temiz.',
  'Sadece 3 ay kullanıldı, yeniyle takas düşünürüm.',
  '2 yıl kullanıldı, ancak bakımlı. Şarj hızı hâlâ tam.',
  'Yurt dışından getirildi, Türkiye garantisi yok ama sorunsuz çalışıyor.',
  'Çalışma yüzeyinde hafif kullanım izi var, fonksiyonel açıdan mükemmel.',
];

const NOTIFS = [
  ['recycle', 'Geri Dönüşüm Tamamlandı',      'Bıraktığınız e-atıklar tesise ulaştı. Hesabınıza 120 puan eklendi.'],
  ['recycle', 'Kurye Yolda',                   'Elektrikli kuryeniz yaklaşık 20 dk içinde adresinizde olacak.'],
  ['recycle', 'Atık Teslim Hatırlatması',       'Bekleyen e-atık talebinizi tamamlamayı unutmayın!'],
  ['sell',    'İlanınız Yayında',               'İlanınız incelendi ve pazaryerinde yayımlandı.'],
  ['sell',    'Fiyat Güncellemesi',             'Takip ettiğiniz bir ilanda fiyat düşüşü oldu. Hemen inceleyin!'],
  ['sell',    'İlk Mesajınız Geldi',            'Bir kullanıcı ilanınız hakkında size mesaj gönderdi.'],
  ['reward',  'Yeni Ödül Kilidi Açıldı',        'Tebrikler! 500 puan biriktirerek yeni bir ödül kazandınız.'],
  ['reward',  'Seviye Atladınız 🎉',            'Artık "Yeşil Elçi" seviyesindesiniz. Puan kazanımınız %10 arttı.'],
  ['reward',  'Ödülünüz Sona Eriyor',           'Sepetinizde bekleyen ödülünüzün süresi 3 gün içinde doluyor.'],
  ['general', 'Sistem Güncellemesi',            'Platformda performans iyileştirmeleri ve yeni özellikler eklendi.'],
  ['general', 'Yeni Toplama Noktası',           'Bölgenize yeni bir e-atık toplama noktası eklendi, haritada görün!'],
  ['general', 'Haftalık Rapor',                 'Bu hafta 3.2 kg e-atık önlediniz ve 48 CO₂ birim tasarrufu yaptınız.'],
];

const ACTS = [
  ['recycle', 'Elektronik Atık Teslimi',    () => ({ points: rnd(40, 180), amount: 0 })],
  ['recycle', 'Pil Geri Dönüşümü',         () => ({ points: rnd(10, 50),  amount: 0 })],
  ['recycle', 'Büyük Cihaz Teslimi',       () => ({ points: rnd(100, 300), amount: 0 })],
  ['sell',    'İkinci El Satışı',          () => ({ points: 0, amount: rnd(5, 400) * 50 })],
  ['sell',    'İlan Yayınlama',            () => ({ points: 15, amount: 0 })],
  ['repair',  'Cihaz Onarımı',             () => ({ points: 0, amount: rnd(3, 60) * 50 })],
  ['reward',  'Ödül Kullanıldı',           () => ({ points: -rnd(1, 5) * 250, amount: 0 })],
  ['general', 'Günlük Giriş Bonusu',      () => ({ points: 5, amount: 0 })],
  ['general', 'Arkadaş Daveti',           () => ({ points: 50, amount: 0 })],
];

const REWARDS_DATA = [
  ['Migros 100₺ Hediye Çeki',    'Market alışverişlerinde geçerli',           250,  'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=400&q=80'],
  ['Getir 75₺ İndirim Kodu',     'İlk siparişte geçerli değildir',            175,  'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&q=80'],
  ['Sinema Bileti (2 Kişilik)',   'CGV, Cinemaximum, Cinemapink',              350,  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'],
  ['Starbucks 50₺ Hediye Kartı', 'Tüm Starbucks şubelerinde geçerli',         150,  'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&q=80'],
  ['Trendyol 200₺ Kupon',        'Elektronik kategorisinde geçerli',          400,  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80'],
  ['Akbank 500₺ Cashback',       'Kredi kartı işlemlerinde iade',             900,  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80'],
  ['Ağaç Dikme Sponsorluğu',     '5 fidan Türkiye\'de dikilecek',             500,  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80'],
  ['Spotify 3 Aylık Premium',    'Yeni hesaplarda geçerli',                   600,  'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&q=80'],
];

// ──────────────────────────────────────────────
// CLEAN PREVIOUS DEMO DATA
// ──────────────────────────────────────────────
console.log('🧹 Eski demo verileri temizleniyor...');
const old = (await query(`SELECT id FROM users WHERE email LIKE 'demo__@restart.app'`)).rows.map(r => r.id);
if (old.length) {
  for (const t of ['recycle_logs', 'activities', 'notifications', 'notification_preferences', 'listings', 'products', 'couriers', 'user_stats']) {
    const col = t === 'products' ? 'seller_id' : 'user_id';
    await query(`DELETE FROM ${t} WHERE ${col} = ANY($1::uuid[])`, [old]);
  }
  await query(`DELETE FROM reward_redemptions WHERE user_id = ANY($1::uuid[])`, [old]);
  await query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [old]);
}

// ──────────────────────────────────────────────
// REWARDS CATALOG
// ──────────────────────────────────────────────
console.log('🎁 Ödüller ekleniyor...');
const existingRewards = (await query('SELECT COUNT(*) AS c FROM rewards')).rows[0].c;
if (Number(existingRewards) === 0) {
  for (const [title, subtitle, cost, img] of REWARDS_DATA) {
    await query(
      'INSERT INTO rewards (title, subtitle, points_cost, image_url, is_active) VALUES ($1,$2,$3,$4,true)',
      [title, subtitle, cost, img],
    );
  }
  console.log(`  → ${REWARDS_DATA.length} ödül eklendi`);
} else {
  console.log(`  → Ödüller zaten mevcut, atlanıyor`);
}

// ──────────────────────────────────────────────
// USERS + STATS
// ──────────────────────────────────────────────
console.log('👥 Kullanıcılar oluşturuluyor...');
const hash = await bcrypt.hash('Demo1234!', 10);
const users = [];

for (let i = 0; i < NAMES.length; i++) {
  const email     = `demo${String(i + 1).padStart(2, '0')}@restart.app`;
  const avatar    = pick(AVATARS);
  const { rows } = await query(
    'INSERT INTO users (email, password_hash, full_name, avatar_url, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [email, hash, NAMES[i], avatar, ago(500)],
  );
  const id = rows[0].id;
  users.push({ id, name: NAMES[i] });

  // Varied levels: some power users, some newcomers
  const isHeavyUser = i < 10;
  const points   = isHeavyUser ? rnd(1500, 8500) : rnd(0, 1500);
  const earnings = isHeavyUser ? rnd(20, 300) * 100 : rnd(0, 50) * 100;
  await query(
    'INSERT INTO user_stats (user_id, total_points, total_earnings, repaired_count, prevented_waste_kg) VALUES ($1,$2,$3,$4,$5)',
    [id, points, earnings, rnd(0, 12), (rnd(0, 200) / 10)],
  );

  // notification preferences (all enabled for most, varied for some)
  await query(
    'INSERT INTO notification_preferences (user_id, recycle, marketplace, rewards, system) VALUES ($1,$2,$3,$4,$5)',
    [id, true, Math.random() > 0.2, true, Math.random() > 0.15],
  );
}

const allUsers = (await query('SELECT id FROM users')).rows.map(r => r.id);
console.log(`  → ${users.length} kullanıcı oluşturuldu`);

// ──────────────────────────────────────────────
// ACTIVITIES + NOTIFICATIONS
// ──────────────────────────────────────────────
console.log('📊 Aktiviteler ve bildirimler ekleniyor...');
for (const uid of allUsers) {
  const actCount  = rnd(5, 18);
  const notifCount = rnd(4, 12);

  for (let k = 0; k < actCount; k++) {
    const [type, title, gen] = pick(ACTS);
    const { points, amount } = gen();
    await query(
      'INSERT INTO activities (user_id, activity_type, title, description, points_earned, amount_earned, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [uid, type, title, 'Demo aktivitesi', points, amount, ago(90)],
    );
  }

  for (let k = 0; k < notifCount; k++) {
    const [type, title, body] = pick(NOTIFS);
    await query(
      'INSERT INTO notifications (user_id, type, title, body, is_read, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
      [uid, type, title, body, Math.random() < 0.5, ago(21)],
    );
  }
}

// ──────────────────────────────────────────────
// RECYCLE LOGS
// ──────────────────────────────────────────────
console.log('♻️ Geri dönüşüm kayıtları ekleniyor...');
const centers = (await query(`SELECT id FROM service_centers WHERE type = 'recycle'`)).rows.map(r => r.id);
let nR = 0;
if (centers.length > 0) {
  for (const u of users) {
    const count = rnd(1, 6);
    for (let k = 0; k < count; k++) {
      const kg       = rnd(2, 40) / 2;
      const electric = Math.random() < 0.55;
      const base     = Math.round(kg * 10);
      const bonus    = electric ? Math.round(base * 0.5) : 0;
      const total    = base + bonus;
      await query(
        `INSERT INTO recycle_logs
          (user_id, service_center_id, waste_type, weight_kg, is_electric_transport,
           base_points, bonus_points, total_points, commission_tl, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [u.id, pick(centers), pick(['phone','laptop','tablet','other']),
         kg, electric, base, bonus, total, +(kg * 0.5).toFixed(2), ago(90)],
      );
      nR++;
    }
  }
} else {
  console.log('  ⚠️  service_centers tablosunda kayıt yok, recycle_logs atlandı');
}

// ──────────────────────────────────────────────
// LISTINGS + PRODUCTS (marketplace)
// ──────────────────────────────────────────────
console.log('🛍️ İlanlar ve ürünler ekleniyor...');
let nL = 0, nP = 0;
const categories = Object.keys(CATALOG);

for (const u of users) {
  const listingCount = rnd(2, 7);
  const usedCats = pickN(categories, Math.min(listingCount, categories.length));

  for (let k = 0; k < listingCount; k++) {
    const cat   = usedCats[k % usedCats.length];
    const [name, lo, hi] = pick(CATALOG[cat]);
    const price = round50(rnd(lo, hi));
    const image = pick(IMGS[cat] || IMGS.accessory);
    const loc   = pick(CITIES);
    const desc  = pick(CONDITIONS);
    const sold  = Math.random() < 0.18;
    const daysAgo = rnd(1, 90);

    const l = await query(
      `INSERT INTO listings
        (user_id, title, description, category, price, status, image_url, location, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [u.id, name, desc, cat, price, sold ? 'sold' : 'active', image, loc, ago(daysAgo)],
    );
    await query(
      'INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES ($1,$2,0)',
      [l.rows[0].id, image],
    );
    nL++;

    // Active listings also go to public marketplace with slightly higher rating variance
    if (!sold) {
      await query(
        `INSERT INTO products
          (seller_id, title, description, category, price, rating, location, image_url, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [u.id, name, desc, cat, price, +(rnd(35, 50) / 10).toFixed(1), loc, image, ago(daysAgo)],
      );
      nP++;
    }
  }
}

// ──────────────────────────────────────────────
// COURIERS
// ──────────────────────────────────────────────
console.log('🛵 Kuryeler ekleniyor...');
const vehicleTypes = ['green_courier', 'green_courier', 'green_courier', 'cargo_vehicle'];
// IST, ANK, IZM coords spread
const coordSets = [
  [41.01, 28.97], [41.04, 29.03], [41.02, 28.93], [41.07, 28.89],
  [39.91, 32.85], [39.93, 32.87], [38.42, 27.12], [38.44, 27.15],
];
for (const [i, u] of users.slice(0, 10).entries()) {
  const [baseLat, baseLon] = coordSets[i % coordSets.length];
  await query(
    `INSERT INTO couriers
      (user_id, vehicle_type, is_electric, is_available, capacity_kg,
       rating, total_deliveries, latitude, longitude)
     VALUES ($1,$2,$3,true,$4,$5,$6,$7,$8)`,
    [
      u.id,
      pick(vehicleTypes),
      Math.random() < 0.7,
      rnd(15, 250),
      +(rnd(38, 50) / 10).toFixed(1),
      rnd(0, 500),
      baseLat + (Math.random() - 0.5) * 0.06,
      baseLon + (Math.random() - 0.5) * 0.08,
    ],
  );
}

// ──────────────────────────────────────────────
// SUMMARY
// ──────────────────────────────────────────────
const pCount  = (await query('SELECT COUNT(*) AS c FROM products')).rows[0].c;
const lCount  = (await query('SELECT COUNT(*) AS c FROM listings')).rows[0].c;
const uCount  = (await query('SELECT COUNT(*) AS c FROM users')).rows[0].c;

console.log('\n✅ Seed tamamlandı!');
console.log(`   Kullanıcılar   : ${users.length} demo  (toplam: ${uCount})`);
console.log(`   İlanlar        : ${nL} yeni  (toplam: ${lCount})`);
console.log(`   Marketplace    : ${nP} ürün  (toplam: ${pCount})`);
console.log(`   Geri Dönüşüm  : ${nR} kayıt`);
console.log(`   Kuryeler       : 10`);
console.log('\n   Demo giriş: demo01@restart.app … demo30@restart.app  /  Demo1234!');

await pool.end();
