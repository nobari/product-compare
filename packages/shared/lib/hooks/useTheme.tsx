import '../../index.scss';
import { useStorageSuspense } from './useStorageSuspense';
import { themeStorage } from '../storages';
import { useEffect } from 'react';

export const useTheme = () => {
  const theme = useStorageSuspense(themeStorage);
  useEffect(() => {
    document.body.classList.add(theme);
    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);
  const style = `background-color: ${theme === 'light' ? '#eee' : '#222'};`;
  return { theme, style };
};
