import { BaseStorage, createStorage, StorageType } from './base';

export type Result = { type: 'compare' | 'user' | 'assistant'; data: string };

type ResultsStorage = BaseStorage<Result[]> & {
  set: (results: Result[]) => Promise<void>;
  clear: () => Promise<void>;
  remove: (index: number) => Promise<void>;
  append: (type: Result['type']) => Promise<Result>;
  updateLast: (data: string) => Promise<void>;
};

const storage = createStorage<Result[]>('results-storage-key', [], {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const resultsStorage: ResultsStorage = {
  ...storage,
  clear: async () => {
    await storage.set([]);
  },
  set: storage.set,
  append: async (type: Result['type']) => {
    const results = await storage.get();
    const newResult: Result = { type, data: '' };
    await storage.set([...results, newResult]);
    return newResult;
  },
  updateLast: async (data: string) => {
    const results = await storage.get();
    results[results.length - 1].data = data;
    await storage.set(results);
  },
  remove: async (index: number) => {
    const results = await storage.get();
    results.splice(index, 1);
    await storage.set(results);
  },
};
