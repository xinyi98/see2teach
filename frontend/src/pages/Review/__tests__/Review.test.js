import { render, screen, waitFor, fireEvent } from '../../../test-utils';

import { MemoryRouter } from 'react-router';
import Review from '../Review';
import { server } from '../../../mocks/mswServer';
import { rest } from 'msw';

describe('test appropriate actions available depending on status &  is reviewer or reviewee', () => {
  // renders page with route name
  function renderPage() {
    render(
      <MemoryRouter initialEntries={['/review/103']}>
        <Review />
      </MemoryRouter>
    );
  }
  // setup blanket review without status
  let review;
  const url = process.env.REACT_APP_API_URL;
  const claire = { id: 123, upi: 'ata434', name: 'claire donald' }; // base user
  const donald = { id: 323, upi: 'kims345', name: 'donald trump' };
  // setup baseline review that will be altered in each test
  beforeAll(() => {
    // base review!! update fields as neccesary for each test
    review = {
      action_plan: null,
      aspects: [
        {
          aspect_name: 'General',
          reviewee_comments: 'content comment',
          review: null,
          action_points: [],
        },
        {
          aspect_name: 'Content',
          reviewee_comments: 'content comment',
          review: 'content review comments',
          action_points: [],
        },
      ],
      course: 'se761',
      course_description: 'good description about course',
      guidedPrompts: [],
      id: 103,
      reason: 'good reason',
      request_response: null,
      reviewee: claire,
      reviewer: donald,
      status: 'complete',
    };
  });

  beforeEach(() => {
    // reset users
    review.reviewee = claire;
    review.reviewer = donald;
    server.use(
      rest.get(`${url}/reviews/:id`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(review));
      })
    );
  });
  test('check complete review as reviewee', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/complete/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /export export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /form self reflection/i })).toBeInTheDocument();
    const subjectMatterButton = screen.getByRole('button', { name: /right subject matter/i });
    fireEvent.click(subjectMatterButton);
    await waitFor(() =>
      expect(screen.getByText(/the teacher focusses on factual material/i)).toBeInTheDocument()
    );
  });

  test('check complete page as reviewer', async () => {
    review.reviewee = donald;
    review.reviewer = claire;
    renderPage();
    await waitFor(() => expect(screen.getByText(/complete/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /export export/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /form self reflection/i })).not.toBeInTheDocument();
    // ensure quetionare pops up
    const subjectMatterButton = screen.getByRole('button', { name: /right subject matter/i });
    fireEvent.click(subjectMatterButton);
    await waitFor(() =>
      expect(screen.getByText(/the teacher focusses on factual material/i)).toBeInTheDocument()
    );
  });

  test('check draft request as reviewee', async () => {
    review.status = 'draft';
    renderPage();
    await waitFor(() => expect(screen.getByText(/draft/i)).toBeInTheDocument());

    expect(screen.getByRole('button', { name: /edit request/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /form self reflection/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /right subject matter/i })).not.toBeInTheDocument();
    // ensure tool tip pops up
    fireEvent.mouseEnter(screen.getByTestId('aspects-tooltip-1'));
    await waitFor(() =>
      expect(screen.getByText(/Some description stuff about content/i)).toBeInTheDocument()
    );
  });

  test('check review draft & awaiting peer review as reviewer', async () => {
    review.status = 'review_draft'; // same layout as awaiting peer review so tests both
    review.reviewee = donald;
    review.reviewer = claire;
    renderPage();
    await waitFor(() => expect(screen.getByText(/review draft/i)).toBeInTheDocument());
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add action point/i })[0]).toBeInTheDocument();
    // ensure quetionare pops up
    const subjectMatterButton = screen.getByRole('button', { name: /right subject matter/i });
    fireEvent.click(subjectMatterButton);
    await waitFor(() =>
      expect(screen.getByText(/the teacher focusses on factual material/i)).toBeInTheDocument()
    );
    // general review missing so fire up modal
    fireEvent.click(submitButton);
    await waitFor(() => screen.getByRole('button', { name: /cancel/i }));
  });

  test('check awaiting review as reviewee', async () => {
    review.status = 'awaiting_peer_review'; // same layout as awaiting peer review so tests both
    renderPage();
    await waitFor(() => expect(screen.getByText(/awaiting peer review/i)).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    // ensure quetionare pops up
    const subjectMatterButton = screen.getByRole('button', { name: /right subject matter/i });
    fireEvent.click(subjectMatterButton);
    await waitFor(() =>
      expect(screen.getByText(/the teacher focusses on factual material/i)).toBeInTheDocument()
    );
  });

  test('check pending review as reviewer', async () => {
    review.status = 'pending'; // same layout as awaiting peer review so tests both
    review.reviewee = donald;
    review.reviewer = claire;
    renderPage();
    await waitFor(() => expect(screen.getByText(/pending/i)).toBeInTheDocument());
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    expect(acceptButton).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();

    // general review missing so fire up modal
    fireEvent.click(acceptButton);
    const okButton = await screen.findByRole('button', { name: /ok/i });
    const textBox = screen.getByRole('textbox');
    fireEvent.change(textBox, { target: { value: 'i like the review' } });
    fireEvent.click(okButton);
    // ensure quetionare pops up
    const subjectMatterButton = await screen.findByRole('button', {
      name: /right subject matter/i,
    });
    fireEvent.click(subjectMatterButton);
    await waitFor(() =>
      expect(screen.getByText(/the teacher focusses on factual material/i)).toBeInTheDocument()
    );
  });

  test('check pending review as reviewer', async () => {
    review.status = 'pending'; // same layout as awaiting peer review so tests both

    renderPage();
    await waitFor(() => expect(screen.getByText(/pending/i)).toBeInTheDocument());

    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /decline/i })).not.toBeInTheDocument();
    // ensure tool tip pops up
    fireEvent.mouseEnter(screen.getByTestId('aspects-tooltip-1'));
    await waitFor(() =>
      expect(screen.getByText(/Some description stuff about content/i)).toBeInTheDocument()
    );
  });

  test('check awaiting action plan', async () => {
    review.status = 'awaiting_action_plan'; // same layout as awaiting peer review so tests both

    renderPage();
    await waitFor(() => expect(screen.getByText(/awaiting action plan/i)).toBeInTheDocument());
    const submitActionPlanButton = screen.getByRole('button', { name: /submit action plan/i });
    expect(submitActionPlanButton).toBeInTheDocument();
    // ensure tool tip pops up
    fireEvent.mouseEnter(screen.getByTestId('aspects-tooltip-1'));
    await waitFor(() =>
      expect(screen.getByText(/Some description stuff about content/i)).toBeInTheDocument()
    );
  });

  test('check awaiting action plan from reviewer point', async () => {
    review.status = 'awaiting_action_plan'; // same layout as awaiting peer review so tests both
    review.reviewee = donald;
    review.reviewer = claire;

    renderPage();
    await waitFor(() => expect(screen.getByText(/awaiting action plan/i)).toBeInTheDocument());
    const submitActionPlanButton = screen.queryByRole('button', { name: /submit action plan/i });
    expect(submitActionPlanButton).not.toBeInTheDocument();
    // ensure tool tip pops up
    fireEvent.mouseEnter(screen.getByTestId('aspects-tooltip-1'));
    await waitFor(() =>
      expect(screen.getByText(/Some description stuff about content/i)).toBeInTheDocument()
    );
  });
});
