import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import CustomPagination from '../components/pagination';

test('CustomPagination component renders without crashing', () => {
  render(<CustomPagination />);
});

it('CustomPagination component matches the snapshot', () => {
  const tree = renderer.create(<CustomPagination />).toJSON();
  expect(tree).toMatchSnapshot();
});
