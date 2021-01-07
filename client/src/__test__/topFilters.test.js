import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import TopFilters from '../components/topFilters';

test('TopFilters component renders without crashing', () => {
  render(<TopFilters />);
});

it('TopFilters component matches the snapshot', () => {
  const tree = renderer.create(<TopFilters />).toJSON();
  expect(tree).toMatchSnapshot();
});
