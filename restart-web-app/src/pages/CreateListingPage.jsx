import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Upload, ArrowLeft } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/sell');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ fontSize: '14px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Yeni İkinci El İlanı Yayınla</h1>

      <GlassCard>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>İlan Başlığı</label>
              <input type="text" required placeholder="Örn: Temiz Kullanılmış iPhone 12 128GB" style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.3)', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Kategori</label>
              <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.3)' }}>
                <option>Akıllı Telefon</option>
                <option>Dizüstü Bilgisayar</option>
                <option>Tablet</option>
                <option>Aksesuar</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>İstenen Fiyat (TL)</label>
              <input type="number" required placeholder="₺0" style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.3)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Açıklama</label>
              <textarea rows={4} placeholder="Cihazın durumu, kozmetiği, kutu/fatura bilgisi..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.3)' }} />
            </div>

            <GradientButton type="submit" fullWidth>
              İlanı Yayınla 🏷️
            </GradientButton>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>İlanınız Başarıyla Yayınlandı! 🎉</h2>
            <p style={{ opacity: 0.8 }}>Satış sayfasına yönlendiriliyorsunuz...</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default CreateListingPage;
