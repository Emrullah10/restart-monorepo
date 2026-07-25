INSERT INTO service_centers (name, type, latitude, longitude, rating, tags, address, is_active)
VALUES
  ('TeknoFix Kadıköy', 'repair', 40.9905, 29.0280, 4.8, 'Teknoloji Merkezi', 'Kadıköy, İstanbul', true),
  ('Mobil Servis Point', 'repair', 41.0420, 29.0100, 4.6, 'Hızlı Onarım', 'Şişli, İstanbul', true),
  ('Beşiktaş Geri Dönüşüm Noktası', 'recycle', 41.0422, 29.0083, 4.5, 'Elektronik Atık', 'Beşiktaş, İstanbul', true),
  ('Kadıköy Geri Dönüşüm Merkezi', 'recycle', 40.9827, 29.0330, 4.3, 'Elektronik Atık', 'Kadıköy, İstanbul', true),
  ('İkinci El Elektronik Bakırköy', 'sell', 40.9819, 28.8772, 4.4, 'İkinci El', 'Bakırköy, İstanbul', true),
  ('Teknoloji Pazarı Üsküdar', 'sell', 41.0226, 29.0159, 4.2, 'İkinci El', 'Üsküdar, İstanbul', true)
ON CONFLICT DO NOTHING;
