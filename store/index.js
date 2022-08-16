import { atom } from 'recoil';
export const authState = atom({
  key: 'store.authState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export const spinnerAtom = atom({
  key: 'spinnerAtom',
  default: false,
});
