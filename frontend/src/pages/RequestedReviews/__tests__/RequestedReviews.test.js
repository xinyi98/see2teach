import RequestedReviews from '../RequestedReviews';
import { MemoryRouter } from 'react-router';
import { render, waitFor, screen, fireEvent } from '../../../test-utils';

test('ensure all reviews displayed correctly & filter by status', async () => {
  render(
    <MemoryRouter initialEntries={['/my-reviews']}>
      <RequestedReviews />
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByRole('cell', { name: /review draft/i })).toBeInTheDocument()
  );
  // expect(screen.queryByRole('cell', { name: 'Draft' })).not.toBeInTheDocument();
  //dropdown check if filter works
  const statusSelect = screen.getByTestId('filter-status-select').firstElementChild;
  fireEvent.mouseDown(statusSelect);
  const pendingFilter = await screen.findByRole('option', { name: /pending/i });
  fireEvent.click(pendingFilter);

  expect(screen.getByRole('cell', { name: /pending/i })).toBeInTheDocument();
});
