import Decx from './index';

let store;
beforeAll(() => {
  const number = (state = 0, { type, payload }) => {
    switch (type) {
      case 'INC':
        return state + payload;
      case 'DEC':
        return state - payload;
      default:
        return state;
    }
  };
  const text = (state = '', { type, payload }) => {
    switch (type) {
      case 'SCREAM':
        return state + payload;
      case 'RUN':
        return state + payload;
      default:
        return state;
    }
  };
  const reducers = Decx.combinereducers({ number, text });
  store = new Decx.Store(reducers);
});

test('testing state', () => {
  expect(store.getState()).toEqual({ number: 0, text: '' });
});
