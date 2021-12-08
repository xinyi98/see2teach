import RequestReviewPage from '../index';
import { render, waitFor, fireEvent, screen } from '../../../test-utils';
import { MemoryRouter } from 'react-router';

test('full review request and submit', async () => {
  render(
    <MemoryRouter>
      <RequestReviewPage />
    </MemoryRouter>
  );

  // fill in course details
  //dropdown
  const reviewSelect = screen.getByTestId('review-select').firstElementChild;
  fireEvent.mouseDown(reviewSelect);
  const donaldDropdown = await screen.findByText(/donald/i);
  fireEvent.click(donaldDropdown);
  //fields to enter
  fireEvent.change(screen.getByLabelText(/reason for requesting peer review/i), {
    target: { value: 'reasoning' },
  });

  fireEvent.change(screen.getByLabelText('Course'), { target: { value: 'se761' } });

  fireEvent.change(screen.getByLabelText(/course description/i), {
    target: { value: 'description' },
  });

  let nextButton = screen.getByRole('button', { name: /next/i });
  fireEvent.click(nextButton);

  // comments page
  await waitFor(() => expect(screen.getByText(/teaching aspects/i)).toBeInTheDocument());
  // drop down select aspect
  const selectAspects = screen.getByTestId('aspects-select').firstElementChild;
  fireEvent.mouseDown(selectAspects);
  const contentAspect = await screen.findByText(/assesments/i);
  fireEvent.click(contentAspect);
  //enter info into tabs
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'general comment' } });
  const contentTab = screen.getByRole('tab', { name: /assesments/i });
  fireEvent.click(contentTab);
  const contentBox = await screen.findByRole('textbox');
  fireEvent.change(contentBox, { target: { value: 'assesments comment' } });
  nextButton = screen.getByRole('button', { name: /next/i });
  fireEvent.click(nextButton);
  // // summary page & check form filled in
  await waitFor(() => expect(screen.getByText(/peer review request summary/i)).toBeInTheDocument());

  expect(screen.getByText(/se761/i)).toBeInTheDocument();
  expect(screen.getByText(/reasoning/i)).toBeInTheDocument();
  expect(screen.getByText(/general comment/i)).toBeInTheDocument();
  //const submitButton = await screen.getByRole('button', { name: /submit/i });
  //userEvent.click(submitButton);
});
