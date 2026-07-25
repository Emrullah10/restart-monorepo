import React, { useState } from 'react';
import { Smartphone, Laptop, Tablet, Cpu, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import styles from './RecyclePage.module.scss';

export const RecyclePage = () => {
  const { t } = useTranslation();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ brand: '', model: '', condition: 'working', notes: '' });
  const [success, setSuccess] = useState(false);

  const devices = [
    { id: 'phone', title: t('devicePhone'), subtitle: t('devicePhoneSub'), icon: Smartphone, color: '#3B82F6' },
    { id: 'laptop', title: t('deviceLaptop'), subtitle: t('deviceLaptopSub'), icon: Laptop, color: '#A855F7' },
    { id: 'tablet', title: t('deviceTablet'), subtitle: t('deviceTabletSub'), icon: Tablet, color: '#10B981' },
    { id: 'other', title: t('deviceOther'), subtitle: t('deviceOtherSub'), icon: Cpu, color: '#F59E0B' }
  ];

  const handleDeviceSelect = (devId) => {
    setSelectedDevice(devId);
    setStep(2);
  };

  const handleSubmitRecycle = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('recycleTitle')}</h1>
        <p className={styles.subtitle}>{t('recycleSubtitle')}</p>
      </div>

      {!success ? (
        <>
          {/* Step 1: Device Selection */}
          {step === 1 && (
            <div className={styles.deviceGrid}>
              {devices.map((dev) => {
                const Icon = dev.icon;
                return (
                  <GlassCard
                    key={dev.id}
                    onClick={() => handleDeviceSelect(dev.id)}
                    className={styles.deviceCard}
                  >
                    <div
                      className={styles.iconCircle}
                      style={{ backgroundColor: `${dev.color}1A`, color: dev.color }}
                    >
                      <Icon size={32} />
                    </div>
                    <div className={styles.deviceText}>
                      <h3 className={styles.deviceTitle}>{dev.title}</h3>
                      <p className={styles.deviceSub}>{dev.subtitle}</p>
                    </div>
                    <ArrowRight className={styles.arrowIcon} size={20} />
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* Step 2: Details Form */}
          {step === 2 && (
            <GlassCard className={styles.formCard}>
              <button onClick={() => setStep(1)} className={styles.backBtn}>
                ← Cihaz Seçimine Dön
              </button>

              <h2 className={styles.formTitle}>Cihaz Detaylarını Girin</h2>

              <form onSubmit={handleSubmitRecycle} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Marka / Model</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Apple iPhone 11 veya Dell XPS 13"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Cihaz Durumu</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className={styles.input}
                  >
                    <option value="working">Çalışıyor (Kullanılabilir)</option>
                    <option value="minor_fault">Hafif Hasarlı / Ekran Kırık</option>
                    <option value="non_functional">Çalışmıyor / Hurda</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Teslimat Yöntemi</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioOption}>
                      <input type="radio" name="delivery" defaultChecked />
                      <span>Kurye ile Evden Alım (+250 Puan)</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input type="radio" name="delivery" />
                      <span>Anlaşmalı Noktaya Bırakma (+300 Puan)</span>
                    </label>
                  </div>
                </div>

                <GradientButton type="submit" fullWidth>
                  Geri Dönüşüm Talebi Oluştur 🚀
                </GradientButton>
              </form>
            </GlassCard>
          )}
        </>
      ) : (
        /* Success Screen */
        <GlassCard className={styles.successCard}>
          <div className={styles.successIconBox}>
            <CheckCircle2 size={64} className={styles.successIcon} />
          </div>
          <h2 className={styles.successTitle}>Tebrikler! Talebiniz Alındı 🌿</h2>
          <p className={styles.successSub}>
            Elektronik atığınızı doğaya kazandırdığınız için <strong>+300 Çevre Puanı</strong> ve <strong>2.4kg CO₂ tasarrufu</strong> kazandınız!
          </p>
          <div className={styles.successBadge}>
            <ShieldCheck size={20} /> <span>Sıfır Atık Sertifikalı Geri Dönüşüm</span>
          </div>
          <GradientButton onClick={() => { setSuccess(false); setStep(1); }}>
            Yeni Bir Geri Dönüşüm Yap
          </GradientButton>
        </GlassCard>
      )}
    </div>
  );
};

export default RecyclePage;
