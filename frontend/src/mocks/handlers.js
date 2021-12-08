import { rest } from 'msw';

// add all mocks requests here!!
const url = process.env.REACT_APP_API_URL;
const reviews = [
  {
    course: 'se761',
    last_updated: '2021-07-07T11:00:00.000Z',
    id: 89,
    name: 'donald trump',
    status: 'draft',
  },
  {
    course: 'se751',
    last_updated: '2021-09-07T11:00:00.000Z',
    id: 34,
    name: 'lebron james',
    status: 'review_draft',
  },
  {
    course: 'se762',
    last_updated: '2021-10-07T11:00:00.000Z',
    id: 33,
    name: 'steph curry',
    status: 'pending',
  },
];
export const handlers = [
  // mock 2 users to select
  rest.get(`${url}/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 123, upi: 'ata434', name: 'claire donald' },
        { id: 323, upi: 'kims345', name: 'donald trump' },
      ])
    );
  }),
  // return claire donald as it will be chosen
  rest.get(`${url}/login`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 123, upi: 'ata434', name: 'claire donald' }));
  }),
  // get aspects
  rest.get(`${url}/aspects`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { name: 'Content', description: 'Some description stuff about content' },
        { name: 'Assesments', description: 'Some description stuff about assesments' },
        { name: 'Labs', description: 'Some description stuff about labs' },
        { name: 'General', description: 'some general stuff' },
      ])
    );
  }),
  // prompts
  rest.get(`${url}/prompts`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { category: 'Subject matter', name: 'the teacher focusses on factual material' },
        { category: 'Online elements', name: 'Course page layout nice' },
        { category: 'Style', name: 'Style of teaching appropriate' },
      ])
    );
  }),
  // //update reviews
  // rest.put(`${url}/reviews/:id`, (req, res, ctx) => {
  //   return res(ctx.status(201));
  // }),
  // my reviews & requested reviews page
  rest.get(`${url}/reviews`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(reviews));
  }),
  //delete request
  rest.delete(`${url}/reviews/:id`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('deleted'));
  }),
];

// default handlers to ensure no actual api request is made if missed mocking
export const defaultHandlers = [
  rest.get('*', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.post('*', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.patch('*', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.put('*', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.delete('*', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
];
