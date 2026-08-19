import { languages } from '../data/languages';

type Props = { value: string; onChange: (value: string) => void; label?: string; dark?: boolean };

export function LanguageSelect({ value, onChange, label, dark = false }: Props) {
  return (
    <label className={dark ? 'language-control dark' : 'language-control'}>
      {label && <span>{label}</span>}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {languages.map((language) => <option key={language.code} value={language.code}>{language.native}</option>)}
      </select>
    </label>
  );
}
