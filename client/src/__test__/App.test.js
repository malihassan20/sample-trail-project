import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import App from '../App';

test('App component renders without crashing', () => {
  render(<App />);
});

it('App component matches the snapshot', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
