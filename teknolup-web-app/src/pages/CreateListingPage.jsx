import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, cx } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useUploadImages, useCreateListing } from '@hooks/queries/useMarketplace';
import { LISTING_CATEGORIES } from '@features/marketplace/constants';
import { CITIES } from '@shared/cities';

const MAX_PHOTOS = 5;
const MAX_DESC = 500;
const input = 'w-full rounded-r2 border border-line bg-field p-space-3 font-body-md text-body-md text-fg placeholder:text-fg-3 focus:border-transparent focus:outline-2 focus:outline-offset-2 focus:outline-accent';
const label = 'font-label text-label uppercase text-fg';

export const CreateListingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const [form, setForm] = useState({ title: '', category: '', price: '', description: '', location: '' });
  const [photos, setPhotos] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const uploadImages = useUploadImages();
  const createListing = useCreateListing();
  const busy = uploadImages.isPending || createListing.isPending;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSelect = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPhotos((prev) => [...prev, ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))].slice(0, MAX_PHOTOS));
    e.target.value = '';
  };
  const remove = (i) => setPhotos((prev) => { const n = [...prev]; URL.revokeObjectURL(n[i].previewUrl); n.splice(i, 1); return n; });

  const submit = async (e) => {
    e.preventDefault(); setError(null);
    if (!userId) { setError(t('listing.needLogin')); return; }
    try {
      let images = [];
      if (photos.length) images = (await uploadImages.mutateAsync(photos.map((p) => p.file))).imageUrls ?? [];
      await createListing.mutateAsync({ userId, title: form.title, description: form.description, category: form.category, price: Number(form.price), location: form.location, images });
      setSubmitted(true);
      setTimeout(() => navigate('/sell'), 1500);
    } catch (err) { setError(err.response?.data?.message ?? t('listing.failed')); }
  };

  const slot = 'flex aspect-square cursor-pointer items-center justify-center rounded-r2 border border-dashed border-line-strong bg-field transition-colors hover:bg-hover';
  return (
    <div className="flex justify-center p-space-6 pb-space-16 md:pb-space-6">
      <div className="flex w-full max-w-[640px] flex-col gap-space-8">
        <div className="mb-space-4 border-l-[3px] border-sell py-1 pl-space-4">
          <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tight text-fg md:font-display-lg md:text-display-lg">{t('listing.title')}</h1>
          <p className="mt-space-2 font-body-md text-body-md text-fg-2">{t('listing.subtitle')}</p>
        </div>
        {submitted ? (
          <div className="rounded-r4 border border-line bg-accent-subtle p-space-8 text-center"><h2 className="font-heading-md text-heading-md text-on-accent-subtle">{t('listing.success')}</h2><p className="mt-2 font-body-md text-body-md text-fg-2">{t('listing.redirecting')}</p></div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-space-8">
            <section className="flex flex-col gap-space-3">
              <span className={label}>{t('listing.photos')}</span>
              <p className="mb-space-2 font-caption text-caption text-fg-2">{t('listing.photosHint')}</p>
              <div className="grid grid-cols-2 gap-space-3 md:grid-cols-5">
                {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
                  const p = photos[i];
                  const first = i === 0;
                  const cls = cx(slot, first && 'col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto');
                  if (p) return (
                    <div key={p.previewUrl} className={cx('relative overflow-hidden rounded-r2 border border-line', first ? 'col-span-2 aspect-square md:col-span-1 md:row-span-2 md:aspect-auto' : 'aspect-square')}>
                      <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                      <button type="button" aria-label={t('listing.remove')} onClick={() => remove(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-r2 bg-surface/90 text-fg"><Icon name="close" size={16} /></button>
                    </div>
                  );
                  return (
                    <label key={i} className={cls}>
                      {first ? (<div className="flex flex-col items-center"><Icon name="add_photo_alternate" className="mb-space-1 text-fg-2" /><span className="text-center font-label text-label uppercase text-fg-2">{t('listing.addCover')}</span></div>) : <Icon name="add" className="text-fg-outline" />}
                      <input type="file" accept="image/*" multiple onChange={onSelect} className="sr-only" />
                    </label>
                  );
                })}
              </div>
            </section>
            <section className="flex flex-col gap-space-6">
              <div className="flex flex-col gap-space-2"><label htmlFor="title" className={label}>{t('listing.titleLabel')}</label><input id="title" required value={form.title} onChange={set('title')} placeholder={t('listing.titlePlaceholder')} className={input} /></div>
              <div className="flex flex-col gap-space-2"><label htmlFor="category" className={label}>{t('listing.category')}</label>
                <div className="relative"><select id="category" required value={form.category} onChange={set('category')} className={cx(input, 'appearance-none')}><option value="" disabled>{t('listing.categoryPlaceholder')}</option>{LISTING_CATEGORIES.map((c) => <option key={c} value={c}>{t(`market.categories.${c}`)}</option>)}</select><Icon name="expand_more" className="pointer-events-none absolute right-space-3 top-1/2 -translate-y-1/2 text-fg-2" /></div>
              </div>
            </section>
            <section className="flex flex-col gap-space-2">
              <div className="flex items-end justify-between"><label htmlFor="description" className={label}>{t('listing.description')}</label><span className="font-caption text-caption text-fg-2">{form.description.length} / {MAX_DESC}</span></div>
              <textarea id="description" required maxLength={MAX_DESC} value={form.description} onChange={set('description')} placeholder={t('listing.descriptionPlaceholder')} className={cx(input, 'h-[120px] resize-none')} />
            </section>
            <section className="grid grid-cols-1 gap-space-6 md:grid-cols-2">
              <div className="flex flex-col gap-space-2"><label htmlFor="price" className={label}>{t('listing.price')}</label><input id="price" required type="number" min="0" value={form.price} onChange={set('price')} placeholder="0,00" className={cx(input, 'text-right font-data-lg text-data-lg leading-none')} /></div>
              <div className="flex flex-col gap-space-2"><label htmlFor="location" className={label}>{t('listing.location')}</label>
                <div className="relative"><select id="location" value={form.location} onChange={set('location')} className={cx(input, 'appearance-none pl-space-10')}><option value="">{t('listing.locationPlaceholder')}</option>{CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select><Icon name="location_on" className="pointer-events-none absolute left-space-3 top-1/2 -translate-y-1/2 text-fg-2" /><Icon name="expand_more" className="pointer-events-none absolute right-space-3 top-1/2 -translate-y-1/2 text-fg-2" /></div>
              </div>
            </section>
            <section className="flex items-start gap-space-3 rounded-r4 border border-line bg-strong p-space-4">
              <Icon name="shield" className="mt-1 text-accent" />
              <div><h4 className="mb-space-1 font-label text-label uppercase text-fg">{t('listing.tipsTitle')}</h4><p className="font-caption text-caption text-fg-2">{t('listing.tipsBody')}</p></div>
            </section>
            {error && <p role="alert" className="font-caption text-caption text-danger">{error}</p>}
            <section className="mt-space-2 border-t border-line pt-space-4">
              <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-space-2 rounded-r2 bg-accent px-space-6 py-space-4 font-label text-label uppercase text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"><span>{busy ? t('common.loading') : t('listing.publish')}</span><Icon name="arrow_forward" /></button>
            </section>
          </form>
        )}
      </div>
    </div>
  );
};
export default CreateListingPage;
