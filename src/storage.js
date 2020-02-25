import localforage from 'localforage';
import pako from 'pako';

localforage.config({
  driver: localforage.LOCALSTORAGE,
});

export const localforageWithCompressingBackend = {
  async set(key, value) {
    await localforage.setItem(key, pako.deflate(JSON.stringify(value), {to: 'string'}));
    return value;
  },
  async get(key, _default) {
    let result = await localforage.getItem(key);
    if (result === null) {
      result = _default == null ? null : _default;
    } else {
      try {
        result = JSON.parse(pako.inflate(result, {to: 'string'}));
      } catch (e) {
        result = null;
      }
    }
    return result;
  },
};

export default localforageWithCompressingBackend;