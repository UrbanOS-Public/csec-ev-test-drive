import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('supports mocking', () => {
  const mockedFn = jest.fn();
  expect(mockedFn.mock.calls.length).toBe(0);
});
