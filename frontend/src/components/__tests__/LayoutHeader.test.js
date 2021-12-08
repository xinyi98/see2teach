import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { AppContextProvider } from '../../context/AppContextProvider';
import LayoutHeader from '../GeneralLayout/LayoutHeader';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

test('snapshot test for header', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <AppContextProvider>
          <LayoutHeader />
        </AppContextProvider>
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
