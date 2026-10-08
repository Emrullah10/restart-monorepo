import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Switch, Skeleton } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@hooks/queries/useNotificationPreferences';

const ROWS = [['recycle', 'recycling'], ['marketplace', 'sell'], ['rewards', 'redeem'], ['system', 'notifications']];

export const NotificationPreferencesPage = () => {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, isError } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences(userId);
  return (
    <main className="flex justify-center px-space-6 py-space-10">
      <div className="flex w-full max-w-[640px] flex-col gap-space-8">
        <Link to="/settings" className="flex items-center gap-space-2 font-label text-label text-fg-2 hover:text-accent"><Icon name="arrow_back" size={18} />{t('nav.settings')}</Link>
        <div className="flex flex-col gap-space-2">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-fg">{t('settings.notifPrefs')}</h1>
          <p className="font-body-md text-body-md text-fg-2">{t('settings.notifPrefsHint')}</p>
        </div>
        {isError && <p role="alert" className="font-caption text-caption text-danger">{t('common.error')}</p>}
        <div className="flex flex-col rounded-r4 border border-line bg-raised">
          {isLoading ? <Skeleton className="m-space-5 h-40" /> : ROWS.map(([key, icon], i) => (
            <div key={key} className={`flex items-center justify-between gap-space-4 p-space-5 ${i < ROWS.length - 1 ? 'border-b border-line' : ''}`}>
              <div className="flex items-center gap-space-4"><Icon name={icon} className="text-fg-2" />
                <div className="flex flex-col"><span className="font-heading-md text-base text-fg">{t(`settings.prefs.${key}.title`)}</span><span className="font-caption text-caption text-fg-2">{t(`settings.prefs.${key}.desc`)}</span></div>
              </div>
              <Switch checked={data?.[key] !== false} label={t(`settings.prefs.${key}.title`)} onChange={(v) => update.mutate({ [key]: v })} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
export default NotificationPreferencesPage;
