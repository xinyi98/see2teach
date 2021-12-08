import renderer from 'react-test-renderer';
import Login from '../Login';
import { AppContextProvider } from '../../../context/AppContextProvider';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '../../../test-utils';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  window.sessionStorage.clear();
  jest.restoreAllMocks();
});

test('snapshot test for login page', async () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <AppContextProvider>
          <Login />
        </AppContextProvider>
      </MemoryRouter>
    )
    .toJSON();
  await waitFor(() => expect(tree).toMatchSnapshot());
});

test('testing login and logout works', async () => {
  const { getByTestId, findByText, getByRole } = render(
    <MemoryRouter>
      <Login />{' '}
    </MemoryRouter>
  );
  const loginButton = getByRole('button', { name: /login/i });
  expect(loginButton).toBeDisabled();
  // select from select box and login
  const select = getByTestId('login-select').firstElementChild;
  fireEvent.mouseDown(select);
  const claireDrop = await findByText(/claire/i);
  fireEvent.click(claireDrop);
  expect(loginButton).not.toBeDisabled();
});
