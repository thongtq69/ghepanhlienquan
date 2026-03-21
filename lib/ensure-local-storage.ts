type StorageMap = Map<string, string>;

function createMemoryStorage() {
  const store: StorageMap = new Map();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    }
  } satisfies Storage;
}

const storage = globalThis.localStorage;

if (!storage || typeof storage.getItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: createMemoryStorage()
  });
}
