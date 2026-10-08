import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/ui';
import { LEGAL } from '@features/legal/content';

export const LegalPage = ({ kind }) => {
  const { i18n, t } = useTranslation();
  const doc = (LEGAL[i18n.language] ?? LEGAL.tr)[kind];
  return (
    <article className="mx-auto w-full max-w-[720px] px-space-6 py-space-10">
      <Link to={-1} onClick={(e) => { e.preventDefault(); window.history.back(); }} className="mb-space-6 flex items-center gap-space-2 font-label text-label text-fg-2 hover:text-accent"><Icon name="arrow_back" size={18} />{t('notFound.back')}</Link>
      <h1 className="mb-space-8 font-display-lg-mobile text-display-lg-mobile text-fg md:font-display-lg md:text-display-lg">{doc.title}</h1>
      <div className="flex flex-col gap-space-6">
        {doc.sections.map(([h, b], i) => (
          <section key={h}><h2 className="mb-space-2 font-heading-md text-heading-md text-fg">{i + 1}. {h}</h2><p className="font-body-md text-body-md text-fg-2">{b}</p></section>
        ))}
      </div>
    </article>
  );
};
export default LegalPage;
