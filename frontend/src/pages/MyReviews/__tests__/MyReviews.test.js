import MyReviews from '../MyReviews';

import { MemoryRouter } from 'react-router';
import { render, waitFor, screen, fireEvent } from '../../../test-utils';

test('ensure all reviews displayed correctly & filter by status', async () => {
  render(
    <MemoryRouter initialEntries={['/my-reviews']}>
      <MyReviews />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText(/donald/i)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  // expect(screen.queryByRole('cell', { name: /review draft/i })).not.toBeInTheDocument();
  // //dropdown check if filter works
  const statusSelect = screen.getByTestId('filter-status-select').firstElementChild;
  fireEvent.mouseDown(statusSelect);
  const pendingFilter = await screen.findByRole('option', { name: /pending/i });
  fireEvent.click(pendingFilter);

  expect(screen.getByRole('cell', { name: /pending/i })).toBeInTheDocument();
});

test('check filter by name works', async () => {
  render(
    <MemoryRouter initialEntries={['/my-reviews']}>
      <MyReviews />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText(/donald/i)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  // expect(screen.queryByRole('cell', { name: /review draft/i })).not.toBeInTheDocument();
  //dropdown check if filter works
  const textbox = screen.getByRole('textbox');
  fireEvent.change(textbox, { target: { value: 'steph' } });
  await waitFor(() =>
    expect(screen.queryByRole('cell', { name: /donald/i })).not.toBeInTheDocument()
  );
  expect(screen.getByText(/steph/i));
});
