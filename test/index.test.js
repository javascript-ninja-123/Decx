import { RemobxStore, combinereducers } from '../src/index';
describe('testing remobx', () => {
  let store;
  let reducers;
  let number = (state = 0, { type, payload }) => {
    switch (type) {
      case 'INC':
        return state + payload;
      case 'DEC':
        return state - payload;
      default:
        return state;
    }
  };
  let text = (state = '', { type, payload }) => {
    switch (type) {
      case 'SCREAM':
        return state + payload;
      case 'RUN':
        return state + payload;
      default:
        return state;
    }
  };
  beforeEach(() => {
    reducers = combinereducers({ number, text });
    store = new RemobxStore(reducers);
  });

  test('testing store', () => {
    expect(store).toEqual({ number: 0, text: '' });
  });
});
