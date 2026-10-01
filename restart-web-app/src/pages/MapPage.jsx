import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Icon, cx } from '@components/ui';
import { useServices } from '@hooks/queries/useServices';
import { useUserLocation } from '@hooks/useUserLocation';
import { moduleOf } from '@shared/modules';
import { distanceKm, directionsUrl } from '@shared/geo';
import { formatNumber } from '@shared/format';

const FILTERS = ['all', 'repair', 'recycle', 'sell'];
const CENTER = [41.0082, 28.9784];
const pinIcon = (type) => {
  const m = moduleOf(type);
  return L.divIcon({ className: '', html: `<div class="rs-pin rs-pin--${type in { repair: 1, sell: 1 } ? type : 'recycle'}"><span class="material-symbols-outlined">${m.icon}</span></div>`, iconSize: [32, 32], iconAnchor: [16, 36] });
};

export const MapPage = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initial = params.get('filter');
  const [filter, setFilter] = useState(FILTERS.includes(initial) ? initial : 'all');
  const [q, setQ] = useState('');
  const [map, setMap] = useState(null);
  const here = useUserLocation();
  const { data } = useServices(filter === 'all' ? undefined : filter);
  const list = useMemo(() => (data ?? []).filter((s) => !q || `${s.name} ${s.address}`.toLowerCase().includes(q.toLowerCase())), [data, q]);
  const tile = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col md:flex-row">
      <section className="z-10 flex h-[409px] w-full flex-col border-r border-line bg-field md:h-full md:w-[35%]">
        <div className="border-b border-line bg-surface p-space-6">
          <div className="relative mb-space-4 w-full">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-outline" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('map.search')} className="w-full rounded-r4 border border-line bg-field py-2 pl-10 pr-4 font-body-md text-body-md text-fg placeholder:text-fg-outline transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="no-scrollbar flex gap-space-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={cx('whitespace-nowrap rounded-r12 border px-3 py-1.5 font-label text-label transition-colors', filter === f ? 'border-accent bg-accent-subtle text-accent' : 'border-line bg-surface text-fg-2 hover:bg-muted')}>{t(`map.filters.${f}`)}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-space-4 overflow-y-auto p-space-6">
          <div className="mb-2 font-label text-label uppercase text-fg-outline">{t('map.nearby', { count: list.length })}</div>
          {list.map((s) => {
            const m = moduleOf(s.type);
            const km = distanceKm(here, s);
            const stripe = { repair: 'bg-repair', sell: 'bg-sell' }[s.type] ?? 'bg-accent';
            return (
              <div key={s.id} onClick={() => map?.flyTo([s.latitude, s.longitude], 15)} className="relative flex cursor-pointer gap-space-4 overflow-hidden rounded-r4 border border-line bg-surface p-space-4 transition-colors hover:bg-hover">
                <div className={cx('absolute bottom-0 left-0 top-0 w-[3px]', stripe)} />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r12 border border-line bg-muted"><Icon name={m.icon} className={m.textClass} /></div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading-md text-heading-md text-fg">{s.name}</h3>
                  <p className="mt-1 truncate font-caption text-caption text-fg-2">{s.address}</p>
                  <div className="mt-2"><span className="rounded-r2 bg-strong px-2 py-0.5 font-label text-[10px] uppercase tracking-wider text-fg">{t(`map.filters.${s.type}`, { defaultValue: s.type })}</span></div>
                </div>
                <div className="flex shrink-0 flex-col items-end justify-between">
                  {km != null && <span className="font-label text-label tabular-nums text-fg">{formatNumber(km, 1)} {t('units.km')}</span>}
                  <a href={directionsUrl(s)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} aria-label={t('map.directions')} className="mt-2 text-accent hover:text-accent-hover"><Icon name="directions" size={20} /></a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rs-map-dots relative h-[614px] w-full md:h-full md:w-[65%]">
        <MapContainer ref={setMap} center={CENTER} zoom={12} zoomControl={false} scrollWheelZoom className="h-full w-full">
          <TileLayer key={tile} url={tile} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' />
          {list.filter((s) => s.latitude != null).map((s) => <Marker key={s.id} position={[s.latitude, s.longitude]} icon={pinIcon(s.type)} />)}
        </MapContainer>
        <div className="absolute right-space-6 top-space-6 z-[1000] flex flex-col gap-2">
          {[['add', () => map?.zoomIn()], ['remove', () => map?.zoomOut()]].map(([n, fn]) => (
            <button key={n} type="button" onClick={fn} aria-label={n} className="flex h-10 w-10 items-center justify-center rounded-r2 border border-line bg-surface text-fg shadow-xs transition-colors hover:bg-muted"><Icon name={n} /></button>
          ))}
        </div>
        <div className="absolute bottom-space-6 right-space-6 z-[1000]">
          <button type="button" aria-label={t('map.locate')} onClick={() => here && map?.flyTo([here.latitude, here.longitude], 14)} className="flex h-10 w-10 items-center justify-center rounded-r2 border border-line bg-surface text-accent shadow-xs transition-colors hover:bg-muted"><Icon name="my_location" /></button>
        </div>
      </section>
    </div>
  );
};
export default MapPage;
