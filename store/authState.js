import { atom } from 'recoil';
export const authState = atom({
  key: 'store.authState11', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
