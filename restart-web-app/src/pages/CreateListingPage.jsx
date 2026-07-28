import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import { useAuthStore } from '@store/authStore';
import { useUploadImages, useCreateListing } from '@hooks/queries/useMarketplace';
import styles from './CreateListingPage.module.scss';

const MAX_PHOTOS = 5;

const CATEGORIES = [
  { value: 'phone', label: 'Akıllı Telefon' },
  { value: 'laptop', label: 'Dizüstü Bilgisayar' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'accessory', label: 'Aksesuar' }
];

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);

  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0].value,
    price: '',
    description: '',
    location: ''
  });
  const [photos, setPhotos] = useState([]); // { file, previewUrl }
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const uploadImages = useUploadImages();
  const createListing = useCreateListing();

  const isSubmitting = uploadImages.isPending || createListing.isPending;

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setPhotos((prev) => {
      const combined = [...prev, ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))];
      return combined.slice(0, MAX_PHOTOS);
    });
    e.target.value = '';
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('İlan yayınlamak için giriş yapmalısınız.');
      return;
    }

    try {
      let images = [];
      if (photos.length > 0) {
        const uploadResult = await uploadImages.mutateAsync(photos.map((p) => p.file));
        images = uploadResult.imageUrls ?? [];
      }

      await createListing.mutateAsync({
        userId,
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        location: form.location,
        images
      });

      setSubmitted(true);
      setTimeout(() => navigate('/sell'), 1500);
    } catch (err) {
      setError(err.response?.data?.message ?? 'İlan yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <h1 className={styles.pageTitle}>Yeni İkinci El İlanı Yayınla</h1>

      <GlassCard>
        {!submitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Fotoğraflar ({photos.length}/{MAX_PHOTOS})</label>
              <div className={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <div key={photo.previewUrl} className={styles.photoThumb}>
                    <img src={photo.previewUrl} alt={`Fotoğraf ${index + 1}`} />
                    <button type="button" className={styles.removePhotoBtn} onClick={() => removePhoto(index)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <label className={styles.photoUploadTile}>
                    <ImagePlus size={22} />
                    <span>Ekle</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className={styles.hiddenInput}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>İlan Başlığı</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleFieldChange('title')}
                placeholder="Örn: Temiz Kullanılmış iPhone 12 128GB"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Kategori</label>
              <select value={form.category} onChange={handleFieldChange('category')} className={styles.input}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>İstenen Fiyat (TL)</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={handleFieldChange('price')}
                placeholder="0"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Konum</label>
              <input
                type="text"
                value={form.location}
                onChange={handleFieldChange('location')}
                placeholder="Örn: Kadıköy, İstanbul"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Açıklama</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={handleFieldChange('description')}
                placeholder="Cihazın durumu, kozmetiği, kutu/fatura bilgisi..."
                className={styles.input}
              />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <GradientButton type="submit" fullWidth isLoading={isSubmitting}>
              İlanı Yayınla 🏷️
            </GradientButton>
          </form>
        ) : (
          <div className={styles.successState}>
            <h2 className={styles.successTitle}>İlanınız Başarıyla Yayınlandı! 🎉</h2>
            <p className={styles.successSub}>Satış sayfasına yönlendiriliyorsunuz...</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default CreateListingPage;
