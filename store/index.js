import { atom } from 'recoil';
export const authState = atom({
  key: 'authState',
  default: '',
});

export const spinnerAtom = atom({
  key: 'spinnerAtom',
  default: false,
});

export const claimsState = atom({
  key: 'claimsState',
  default: [],
});

export const usersState = atom({
  key: 'usersState',
  default: [],
});

export const requestsState = atom({
  key: 'requestsState',
  default: [],
});

export const hideRequestsState = atom({
  key: 'hideRequestsState',
  default: [],
});
