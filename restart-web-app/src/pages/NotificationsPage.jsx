import React from 'react';
import { Bell, CheckCircle2, Tag, Gift } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';

export const NotificationsPage = () => {
  const notifs = [
    { id: 1, title: 'Geri Dönüşüm Puanı Eklendi', desc: 'iPhone 11 teslimatınız onaylandı. +150 Çevre Puanı hesabınıza tanımlandı.', time: '10 dakika önce', icon: CheckCircle2, color: '#22C55E' },
    { id: 2, title: 'Yeni İlan Teklifi', desc: 'iPad Air 5. Nesil ilanınıza ₺15.500 teklif geldi.', time: '2 saat önce', icon: Tag, color: '#F59E0B' },
    { id: 3, title: 'Haftalık Rozet Kazandın!', desc: 'Bu hafta 2 e-atık teslim ederek "E-Atık Avcısı" rozeti kazandın.', time: '1 gün önce', icon: Gift, color: '#EAB308' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Bildirimler</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifs.map((n) => {
          const Icon = n.icon;
          return (
            <GlassCard key={n.id} style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `${n.color}1A`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                <strong style={{ fontSize: '15px' }}>{n.title}</strong>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>{n.desc}</p>
                <span style={{ fontSize: '11px', opacity: 0.5 }}>{n.time}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
