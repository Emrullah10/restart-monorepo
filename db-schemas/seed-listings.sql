-- Demo seller account (password is never used for login; placeholder hash)
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo-seller@restart.app', 'seed-placeholder-hash', 'ReStart Vitrin', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO listings (id, user_id, title, description, category, price, status, image_url, location)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'iPhone 13 Pro 128GB Gümüş', 'Temiz kullanılmış, kutulu, faturalı. Batarya sağlığı %91.', 'phone', 28500, 'active', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600', 'Kadıköy, İstanbul'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Samsung Galaxy S22 256GB', 'Ekran koruyucu ve kılıfla kullanıldı, çizik yok.', 'phone', 19750, 'active', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600', 'Üsküdar, İstanbul'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'MacBook Pro M1 16GB 512GB', 'Garantisi devam ediyor, orijinal kutusunda.', 'laptop', 34000, 'active', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600', 'Beşiktaş, İstanbul'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Dell XPS 13 i7 16GB', 'İş amaçlı az kullanıldı, orijinal şarj aleti dahil.', 'laptop', 27900, 'active', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600', 'Şişli, İstanbul'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'iPad Air 5. Nesil 64GB Wi-Fi', 'Sıfır ayarında, ekran koruyucu takılı.', 'tablet', 16200, 'active', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600', 'Kadıköy, İstanbul'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Samsung Galaxy Tab S8', 'Kalemi ile birlikte, az kullanılmış.', 'tablet', 12800, 'active', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=600', 'Bakırköy, İstanbul'),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'AirPods Pro 2. Nesil MagSafe', 'Faturalı, kutulu, kulak uçları değişti.', 'accessory', 5800, 'active', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=600', 'Kadıköy, İstanbul'),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Apple Watch Series 8 45mm', 'Ekranında çizik yok, orijinal kayışıyla.', 'accessory', 9200, 'active', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=600', 'Şişli, İstanbul'),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'iPhone 12 mini 64GB', 'Batarya değişti, temiz ekran.', 'phone', 14500, 'active', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&q=80&w=600', 'Üsküdar, İstanbul'),
  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Lenovo ThinkPad X1 Carbon', 'Kurumsal kullanım, bakımlı, SSD 512GB.', 'laptop', 22400, 'active', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600', 'Beşiktaş, İstanbul')
ON CONFLICT (id) DO NOTHING;

INSERT INTO listing_images (listing_id, image_url, sort_order)
SELECT v.listing_id, v.image_url, v.sort_order
FROM (
  VALUES
    ('10000000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600', 0),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600', 0),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600', 0)
) AS v(listing_id, image_url, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM listing_images li WHERE li.listing_id = v.listing_id AND li.image_url = v.image_url
);
