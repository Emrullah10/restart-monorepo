import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/ui';

const FEATURES = [
  { icon: 'build', key: 'repair' }, { icon: 'sell', key: 'sell' },
  { icon: 'recycling', key: 'recycle' }, { icon: 'workspace_premium', key: 'reward' },
];

function LoginBrandPanel() {
  const { t } = useTranslation();
  return (
    <div className="hidden w-1/2 flex-col justify-between border-r border-brand-line bg-brand-900 p-space-16 text-on-brand md:flex">
      <div>
        <div className="mb-space-8 flex items-center gap-space-4">
          <Icon name="recycling" size={64} fill={1} />
          <h1 className="font-display-lg text-display-lg">{t('brand.name')}</h1>
        </div>
        <p className="mb-space-16 font-heading-lg text-heading-lg text-brand-400">{t('auth.slogan')}</p>
        <ul className="space-y-space-4">
          {FEATURES.map((f) => (
            <li key={f.key} className="flex items-center gap-space-3">
              <Icon name="check" size={16} className="text-brand-400" />
              <span className="font-body-md text-body-md">{t(`auth.features.${f.key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="font-label text-label text-brand-400 opacity-60">{t('auth.copyright', { year: new Date().getFullYear() })}</div>
    </div>
  );
}

function RegisterBrandPanel() {
  const { t } = useTranslation();
  return (
    <aside className="hidden w-[45%] flex-col justify-between border-r border-brand-line bg-brand-900 p-space-16 lg:flex">
      <div className="flex flex-col gap-space-12">
        <div className="flex items-center gap-space-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-r4 border border-brand-400/30 bg-brand-600">
            <Icon name="recycling" size={28} fill={1} className="text-on-brand" />
          </div>
          <div>
            <h1 className="font-heading-lg text-heading-lg tracking-tight text-on-brand">{t('brand.name')}</h1>
            <p className="mt-1 font-label text-label uppercase tracking-widest text-brand-400">{t('brand.tagline')}</p>
          </div>
        </div>
        <div className="mt-space-16">
          <h2 className="mb-space-8 max-w-[90%] font-display-lg text-display-lg leading-tight text-on-brand">
            {t('auth.registerHeadline1')}<br />{t('auth.registerHeadline2')}
          </h2>
          <ul className="mt-space-12 flex flex-col gap-space-6">
            {FEATURES.map((f) => (
              <li key={f.key} className="flex items-start gap-space-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-r2 border border-brand-400/50 bg-[#141C1A]/50 text-brand-400">
                  <Icon name={f.icon} size={16} fill={1} />
                </div>
                <div>
                  <h3 className="font-heading-md text-heading-md text-on-brand">{t(`auth.features.${f.key}`)}</h3>
                  <p className="mt-1 font-body-md text-body-md text-[#8A9490]">{t(`auth.featureDesc.${f.key}`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-brand-600/30 pt-space-8">
        <p className="font-label text-label uppercase text-brand-400">© {new Date().getFullYear()} TEKNOLUP</p>
        <p className="font-label text-label text-[#8A9490]">v{__APP_VERSION__}</p>
      </div>
    </aside>
  );
}

export const AuthLayout = () => {
  const { t } = useTranslation();
  const register = useLocation().pathname.startsWith('/register');
  if (register) {
    return (
      <div className="flex min-h-screen bg-canvas text-fg">
        <RegisterBrandPanel />
        <main className="relative flex w-full items-center justify-center bg-canvas p-space-6 lg:w-[55%] lg:p-space-16">
          <div className="absolute left-0 top-0 z-20 flex w-full items-center gap-space-3 border-b border-line bg-canvas p-space-6 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-r4 bg-brand-600"><Icon name="recycling" size={18} fill={1} className="text-on-brand" /></div>
            <span className="font-heading-md text-heading-md text-fg">{t('brand.name')}</span>
          </div>
          <div className="mt-space-12 w-full max-w-[420px] lg:mt-0"><Outlet /></div>
        </main>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-canvas text-fg md:h-screen md:flex-row">
      <LoginBrandPanel />
      <div className="flex flex-1 flex-col justify-center bg-canvas px-space-6 py-space-12 sm:px-space-12 lg:px-space-16">
        <div className="mx-auto w-full max-w-[400px]"><Outlet /></div>
      </div>
    </div>
  );
};

export default AuthLayout;
