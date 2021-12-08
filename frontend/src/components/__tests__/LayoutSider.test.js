import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { AppContextProvider } from '../../context/AppContextProvider';
import LayoutSider from '../GeneralLayout/LayoutSider';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

test('snapshot test for sidebar', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <AppContextProvider>
          <LayoutSider />
        </AppContextProvider>
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
