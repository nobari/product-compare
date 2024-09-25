import { createStorage, StorageType, type BaseStorage, SessionAccessLevel } from './base';
import { themeStorage } from './themeStorage';
import { productListStorage, ProductList, ProductListItem } from './productListStorage';
import { resultsStorage, Result } from './resultStorage';
import { settingStorage, Setting } from './settingStorage';

export {
  themeStorage,
  productListStorage,
  createStorage,
  StorageType,
  SessionAccessLevel,
  BaseStorage,
  resultsStorage,
  settingStorage,
};

export type { ProductList, ProductListItem, Result, Setting };
