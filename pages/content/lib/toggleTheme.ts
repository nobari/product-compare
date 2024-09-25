import { themeStorage } from '@chrome-extension-boilerplate/shared';

export async function toggleTheme() {
  console.log('initial theme:', await themeStorage.get());
  await themeStorage.toggle();
  console.log('toggled theme:', await themeStorage.get());
}
