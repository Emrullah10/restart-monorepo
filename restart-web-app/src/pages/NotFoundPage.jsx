import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <GlassCard style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}>
        <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#10B981' }}>404</h1>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Sayfa Bulunamadı</h2>
        <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '24px' }}>Aradığınız sayfa kaldırılmış veya taşınmış olabilir.</p>
        <GradientButton onClick={() => navigate('/')}>
          Ana Sayfaya Dön
        </GradientButton>
      </GlassCard>
    </div>
  );
};

export default NotFoundPage;
