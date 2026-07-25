import React from 'react';
import { Sun, Moon, Globe, Shield, Lock } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import ThemeToggle from '@components/ThemeToggle/ThemeToggle';
import LanguageToggle from '@components/LanguageToggle/LanguageToggle';
import { useThemeStore } from '@store/themeStore';

export const SettingsPage = () => {
  const { theme } = useThemeStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Uygulama Ayarları</h1>

      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '16px', display: 'block' }}>Görünüm Teması</strong>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>Açık / Koyu tema tercihinizi belirleyin</span>
          </div>
          <ThemeToggle />
        </div>

        <hr style={{ opacity: 0.1 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '16px', display: 'block' }}>Uygulama Dili</strong>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>Türkçe / English seçenekleri</span>
          </div>
          <LanguageToggle />
        </div>

        <hr style={{ opacity: 0.1 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '16px', display: 'block' }}>Oturum ve Güvenlik</strong>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>HttpOnly Güvenli Cookie Oturumu Aktif</span>
          </div>
          <span style={{ color: '#10B981', fontWeight: '700', fontSize: '13px' }}>Aktif Koruma ✓</span>
        </div>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
