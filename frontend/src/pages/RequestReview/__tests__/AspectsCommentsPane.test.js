import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import AspectsCommentsPane from '../components/AspectsCommentsPane';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

test('snapshot test for aspects comments pane', () => {
  const aspectComments = ['Pace', 'General'];
  const dispatch = jest.fn();
  const tree = renderer
    .create(<AspectsCommentsPane selectedAspects={aspectComments} dispatch={dispatch} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
