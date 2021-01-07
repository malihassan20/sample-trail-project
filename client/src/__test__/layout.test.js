import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import Layout from '../components/layout';

test('Layout component renders without crashing', () => {
  render(<Layout />);
});

it('Layout component matches the snapshot', () => {
  const tree = renderer.create(<Layout />).toJSON();
  expect(tree).toMatchSnapshot();
});
