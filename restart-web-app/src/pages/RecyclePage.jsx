import React, { useState } from 'react';
import { Smartphone, Laptop, Tablet, Cpu, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import { useAuthStore } from '@store/authStore';
import { useServices } from '@hooks/queries/useServices';
import { useLogRecycle } from '@hooks/queries/useRecycle';
import styles from './RecyclePage.module.scss';

const DELIVERY_OPTIONS = [
  { id: 'courier', label: 'Kurye ile Evden Alım (+250 Puan)', isElectricTransport: true },
  { id: 'dropoff', label: 'Anlaşmalı Noktaya Bırakma (+300 Puan)', isElectricTransport: false }
];

export const RecyclePage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    model: '',
    condition: 'working',
    weightKg: '',
    serviceCenterId: '',
    delivery: DELIVERY_OPTIONS[0].id
  });
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const { data: recycleCenters } = useServices('recycle');
  const logRecycle = useLogRecycle();

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

  const handleSubmitRecycle = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('Geri dönüşüm talebi oluşturmak için giriş yapmalısınız.');
      return;
    }
    if (!formData.serviceCenterId) {
      setError('Lütfen bir geri dönüşüm merkezi seçin.');
      return;
    }

    const delivery = DELIVERY_OPTIONS.find((opt) => opt.id === formData.delivery);

    try {
      const response = await logRecycle.mutateAsync({
        userId,
        serviceCenterId: formData.serviceCenterId,
        wasteType: selectedDevice,
        weightKg: Number(formData.weightKg) || 1,
        isElectricTransport: delivery?.isElectricTransport ?? false
      });
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('recycleTitle')}</h1>
        <p className={styles.subtitle}>{t('recycleSubtitle')}</p>
      </div>

      {!result ? (
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
                  <label className={styles.label}>Tahmini Ağırlık (kg)</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    placeholder="Örn: 0.5"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Geri Dönüşüm Merkezi</label>
                  <select
                    required
                    value={formData.serviceCenterId}
                    onChange={(e) => setFormData({ ...formData, serviceCenterId: e.target.value })}
                    className={styles.input}
                  >
                    <option value="">Merkez seçin</option>
                    {(recycleCenters ?? []).map((center) => (
                      <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Teslimat Yöntemi</label>
                  <div className={styles.radioGroup}>
                    {DELIVERY_OPTIONS.map((opt) => (
                      <label key={opt.id} className={styles.radioOption}>
                        <input
                          type="radio"
                          name="delivery"
                          checked={formData.delivery === opt.id}
                          onChange={() => setFormData({ ...formData, delivery: opt.id })}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className={styles.errorText}>{error}</p>}

                <GradientButton type="submit" fullWidth isLoading={logRecycle.isPending}>
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
            Elektronik atığınızı doğaya kazandırdığınız için <strong>+{result.totalPoints ?? result.total_points ?? 0} Çevre Puanı</strong> kazandınız!
          </p>
          <div className={styles.successBadge}>
            <ShieldCheck size={20} /> <span>Sıfır Atık Sertifikalı Geri Dönüşüm</span>
          </div>
          <GradientButton onClick={() => { setResult(null); setStep(1); setSelectedDevice(null); }}>
            Yeni Bir Geri Dönüşüm Yap
          </GradientButton>
        </GlassCard>
      )}
    </div>
  );
};

export default RecyclePage;
