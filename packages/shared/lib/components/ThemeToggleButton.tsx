import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ComponentPropsWithoutRef } from 'react';
import { useStorageSuspense } from '../hooks';
import { themeStorage } from '../storages';

export const ThemeToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(themeStorage);
  return (
    <a
      className={`${props.className} btn btn-sm ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}
      onClick={themeStorage.toggle}>
      <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
    </a>
  );
};
