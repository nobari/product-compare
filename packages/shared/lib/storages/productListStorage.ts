import { BaseStorage, createStorage, StorageType } from './base';

export const productDetailIds = {
  features: 'featurebullets_feature_div',
  importantInformation: 'important-information',
  description: 'productDescription_feature_div',
  overview: 'productOverview_feature_div',
  reviews: 'customerReviewsAttribute_feature_div',
};

export type ProductListItem = {
  from: 'amazon' | 'other';
  id: string;
  url: string;
  title: string;
  image: string;
  price: { val: number; symbol: string; text: string };
  category: string;
  thumbnail: string;
  tables: string;
  details: {
    [key in keyof typeof productDetailIds]: string;
  };
};
export type ProductList = ProductListItem[];

type ProductListStorage = BaseStorage<ProductList> & {
  add: (productToAdd: ProductListItem) => Promise<boolean>;
  clear: () => Promise<void>;
  remove: (productToRemove: ProductListItem) => Promise<void>;
};

const storage = createStorage<ProductList>('product-list-storage-key', [], {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const productListStorage: ProductListStorage = {
  ...storage,
  clear: async () => {
    await storage.set([]);
    chrome.runtime.sendMessage({ action: 'setBadge' }, function (response) {
      console.log(response.result);
    });
  },
  add: async (productToAdd: ProductListItem) => {
    let newProductAdded = true;
    await storage.set(currentProductList => {
      const index = currentProductList.findIndex(product => product.id === productToAdd.id);
      if (index !== -1) {
        newProductAdded = false;
        currentProductList.splice(index, 1);
      }
      const newProductList = [productToAdd, ...currentProductList];
      if (newProductAdded) {
        chrome.runtime.sendMessage({ action: 'setBadge', count: newProductList.length }, function (response) {
          console.log(response.result);
        });
      }
      console.log('newProductList', newProductList);
      return newProductList;
    });
    return newProductAdded;
  },
  remove: async (productToRemove: ProductListItem) => {
    await storage.set(currentProductList => {
      const result = currentProductList.filter(product => product.id !== productToRemove.id);
      chrome.runtime.sendMessage({ action: 'setBadge', count: result.length || undefined }, function (response) {
        console.log(response.result);
      });
      return result;
    });
  },
};
