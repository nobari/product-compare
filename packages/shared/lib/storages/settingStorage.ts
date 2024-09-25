import { BaseStorage, createStorage, StorageType } from './base';

export type Setting = {
  openAIKey?: string;
};

type SettingStorage = BaseStorage<Setting> & {
  set: (setting: Setting) => Promise<void>;
  setOne: (key: string, value: string) => Promise<void>;
  clear: () => Promise<void>;
};

const storage = createStorage<Setting>(
  'setting-storage-key',
  {},
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

export const settingStorage: SettingStorage = {
  ...storage,
  clear: async () => {
    await storage.set({});
  },
  set: storage.set,
  setOne: async (key: string = 'openAIKey', value: string) => {
    await storage.set({
      ...(await storage.get()),
      [key]: value,
    });
  },
};
