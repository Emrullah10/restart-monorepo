// Random demo data for local development. Re-runnable: removes previous demo rows first.
//   node db-schemas/seed-random-demo.mjs          (uses DB_* env / defaults, same as the services)
// Demo logins: demo01@teknolup.com … demo12@teknolup.com, password "Demo1234!"
import bcrypt from 'bcrypt';
import { makeDatasource } from '@teknolup/datasource';
import { makeDatasourceConfig } from '@teknolup/config';

const { query } = makeDatasource(makeDatasourceConfig());
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const ago = (maxDays) => new Date(Date.now() - Math.random() * maxDays * 86400000).toISOString();

const NAMES = ['Ayşe Demir', 'Mehmet Kaya', 'Zeynep Yılmaz', 'Ali Çelik', 'Elif Şahin', 'Burak Arslan', 'Selin Aydın', 'Can Öztürk', 'Deniz Koç', 'Merve Polat', 'Emre Güneş', 'Ceren Aksoy'];
const IMG = {
  phone: ['photo-1632661674596-df8be070a5c5', 'photo-1610945265064-0e34e5519bbf', 'photo-1591337676887-a217a6970a8a'],
  laptop: ['photo-1517336714731-489689fd1ca8', 'photo-1496181133206-80ce9b88a853', 'photo-1588872657578-7efd1f1555ed'],
  tablet: ['photo-1544244015-0df4b3ffc6b0', 'photo-1561154464-82e9adf32764'],
  accessory: ['photo-1600294037681-c80b4cb5b434', 'photo-1434493789847-2f02dc6ca35d'],
};
const img = (c) => `https://images.unsplash.com/${pick(IMG[c])}?auto=format&fit=crop&q=80&w=600`;
const CATALOG = {
  phone: [['iPhone 13 128GB', 17000, 28000], ['iPhone 12 64GB', 11000, 17000], ['Samsung Galaxy S22', 14000, 21000], ['Xiaomi 12T 256GB', 9000, 14000], ['Google Pixel 7', 11000, 16000]],
  laptop: [['MacBook Air M1', 22000, 30000], ['Dell XPS 13', 20000, 29000], ['Lenovo ThinkPad T14', 14000, 22000], ['HP Pavilion 15', 9000, 15000], ['ASUS Zenbook 14', 16000, 24000]],
  tablet: [['iPad Air 4 64GB', 10000, 15000], ['Galaxy Tab S8', 9000, 14000], ['iPad 9. Nesil', 6000, 9500], ['Lenovo Tab P11', 3500, 6000]],
  accessory: [['AirPods Pro 2', 4500, 7000], ['Apple Watch SE', 4000, 7500], ['Sony WH-1000XM4', 4500, 7000], ['Logitech MX Master 3', 2000, 3500], ['Mekanik Klavye', 1200, 3000]],
};
const CITIES = ['Kadıköy, İstanbul', 'Beşiktaş, İstanbul', 'Üsküdar, İstanbul', 'Çankaya, Ankara', 'Karşıyaka, İzmir', 'Nilüfer, Bursa', 'Muratpaşa, Antalya', 'Şişli, İstanbul'];
const CONDITIONS = ['Temiz kullanılmış, kutulu.', 'Faturalı, garantisi devam ediyor.', 'Ekranda çizik yok, orijinal şarj aleti dahil.', 'Batarya sağlığı yüksek, bakımlı.', 'Az kullanıldı, kılıfla birlikte.'];
const NOTIFS = [
  ['recycle', 'Geri Dönüşüm Tamamlandı', 'Bıraktığınız e-atıklar tesise ulaştı. Hesabınıza puan eklendi.'],
  ['recycle', 'Kurye Yolda', 'Elektrikli kuryeniz adresinize doğru yola çıktı.'],
  ['sell', 'İlanınız Yayında', 'İlanınız incelendi ve pazaryerinde yayımlandı.'],
  ['sell', 'Fiyat Güncellemesi', 'Takip ettiğiniz bir ilanda fiyat düşüşü oldu.'],
  ['reward', 'Yeni Ödül Kilidi Açıldı', 'Tebrikler! Yeni bir ödül kazandınız.'],
  ['reward', 'Seviye Atladınız', 'Puanlarınız yeni bir seviyeye ulaştı.'],
  ['general', 'Sistem Güncellemesi', 'Platformda performans iyileştirmeleri yapıldı.'],
  ['general', 'Yeni Toplama Noktası', 'Bölgenize yeni bir e-atık toplama noktası eklendi.'],
];
const ACTS = [
  ['recycle', 'Elektronik Atık Teslimi', () => ({ points: rnd(10, 120), amount: 0 })],
  ['recycle', 'Pil Geri Dönüşümü', () => ({ points: rnd(5, 40), amount: 0 })],
  ['sell', 'İkinci El Satışı', () => ({ points: 0, amount: rnd(5, 300) * 50 })],
  ['repair', 'Cihaz Onarımı', () => ({ points: 0, amount: rnd(3, 40) * 50 })],
  ['reward', 'Ödül Kullanıldı', () => ({ points: -rnd(1, 4) * 250, amount: 0 })],
];

// ---- clean previous demo data
const old = (await query(`SELECT id FROM users WHERE email LIKE 'demo__@teknolup.com'`)).rows.map((r) => r.id);
if (old.length) {
  for (const t of ['recycle_logs', 'activities', 'notifications', 'listings', 'products', 'couriers', 'user_stats']) {
    const col = t === 'products' ? 'seller_id' : 'user_id';
    await query(`DELETE FROM ${t} WHERE ${col} = ANY($1::uuid[])`, [old]);
  }
  await query('DELETE FROM users WHERE id = ANY($1::uuid[])', [old]);
}

// ---- users + stats
const hash = await bcrypt.hash('Demo1234!', 10);
const users = [];
for (let i = 0; i < NAMES.length; i++) {
  const email = `demo${String(i + 1).padStart(2, '0')}@teknolup.com`;
  const { rows } = await query('INSERT INTO users (email, password_hash, full_name, created_at) VALUES ($1,$2,$3,$4) RETURNING id', [email, hash, NAMES[i], ago(400)]);
  const id = rows[0].id;
  users.push({ id, name: NAMES[i] });
  await query('INSERT INTO user_stats (user_id, total_points, total_earnings, repaired_count, prevented_waste_kg) VALUES ($1,$2,$3,$4,$5)', [id, rnd(0, 6500), rnd(0, 120) * 50, rnd(0, 9), rnd(0, 90)]);
}
const allUsers = (await query('SELECT id FROM users')).rows.map((r) => r.id); // includes real accounts

// ---- activities, notifications
for (const uid of allUsers) {
  for (let k = rnd(4, 10); k > 0; k--) {
    const [type, title, gen] = pick(ACTS); const { points, amount } = gen();
    await query('INSERT INTO activities (user_id, activity_type, title, description, points_earned, amount_earned, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)', [uid, type, title, 'Demo kaydı', points, amount, ago(60)]);
  }
  for (let k = rnd(3, 7); k > 0; k--) {
    const [type, title, body] = pick(NOTIFS);
    await query('INSERT INTO notifications (user_id, type, title, body, is_read, created_at) VALUES ($1,$2,$3,$4,$5,$6)', [uid, type, title, body, Math.random() < 0.55, ago(14)]);
  }
}

// ---- recycle logs
const centers = (await query(`SELECT id FROM service_centers WHERE type = 'recycle'`)).rows.map((r) => r.id);
for (const u of users) for (let k = rnd(1, 4); k > 0; k--) {
  const kg = rnd(1, 20) / 2, electric = Math.random() < 0.5, base = Math.round(kg * 10), total = electric ? Math.round(base * 1.5) : base;
  await query('INSERT INTO recycle_logs (user_id, service_center_id, waste_type, weight_kg, is_electric_transport, base_points, bonus_points, total_points, commission_tl, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [u.id, pick(centers), pick(['phone', 'laptop', 'tablet', 'other']), kg, electric, base, electric ? Math.round(base * 0.5) : 0, total, kg * 0.5, ago(60)]);
}

// ---- listings (user's own) + products (public marketplace)
let nL = 0, nP = 0;
for (const u of users) for (let k = rnd(1, 4); k > 0; k--) {
  const cat = pick(Object.keys(CATALOG)); const [name, lo, hi] = pick(CATALOG[cat]); const price = Math.round(rnd(lo, hi) / 50) * 50;
  const loc = pick(CITIES); const desc = pick(CONDITIONS); const image = img(cat);
  const sold = Math.random() < 0.2;
  const l = await query('INSERT INTO listings (user_id, title, description, category, price, status, image_url, location, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id', [u.id, name, desc, cat, price, sold ? 'sold' : 'active', image, loc, ago(45)]);
  await query('INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES ($1,$2,0)', [l.rows[0].id, image]); nL++;
  if (!sold) { await query('INSERT INTO products (seller_id, title, description, category, price, rating, location, image_url, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [u.id, name, desc, cat, price, (rnd(38, 50) / 10), loc, image, ago(45)]); nP++; }
}

// ---- couriers
for (const u of users.slice(0, 6)) {
  await query('INSERT INTO couriers (user_id, vehicle_type, is_electric, is_available, capacity_kg, rating, total_deliveries, latitude, longitude) VALUES ($1,$2,$3,true,$4,$5,$6,$7,$8)',
    [u.id, Math.random() < 0.7 ? 'green_courier' : 'cargo_vehicle', Math.random() < 0.6, rnd(10, 200), rnd(40, 50) / 10, rnd(0, 300), 41.0 + Math.random() * 0.08, 28.9 + Math.random() * 0.15]);
}
console.log(`seeded: ${users.length} users, ${nL} listings, ${nP} products, couriers 6`);
process.exit(0);
