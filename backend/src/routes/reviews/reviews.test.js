import routes from '.';
import express from 'express';
import axios from 'axios';
import { knex, mockDb } from '../../db';
import dateFormat from 'dateformat';

let server, backup;
const url = 'http://localhost:3003';

const peer_review_1 = {
  id: 123,
  reviewee_id: 123456789,
  reviewer_id: 987654321,
  reason: 'test reason',
  course: 'test course',
  course_description: 'test description',
  status: 'Pending',
  last_updated: '2021-09-14',
};

const peer_review_2 = {
  id: 234,
  reviewee_id: 123456789,
  reviewer_id: 555555555,
  reason: 'test reason 2',
  course: 'test course 2',
  course_description: 'test description 2',
  status: 'Pending',
  last_updated: '2021-09-16',
};

const peer_review_aspect_1 = {
  peer_review_id: 123,
  aspect_name: 'Assessment',
  review: 'test review',
  reviewee_comments: 'test comment',
};

const peer_review_aspect_2 = {
  peer_review_id: 234,
  aspect_name: 'General',
  review: '1',
  reviewee_comments: 'test comment 2',
};

const action_point_1 = {
  peer_review_id: 123,
  aspect_name: 'Assessment',
  description: 'test description',
};
// prompts setup for review 1
const prompt1 = {
  peer_review_id: 123,
  guided_prompts_name: 'The teacher focusses on factual material',
  prompt_answer: 'Strongly Agree',
};
const prompt2 = {
  peer_review_id: 234,
  guided_prompts_name: 'The teacher emphasises conceptual understanding',
  prompt_answer: 'Disagree',
};

beforeAll(async () => {
  // Create all the tables and add initial data
  await knex.migrate.latest();
  await knex.seed.run();

  await knex('peer_review').insert(peer_review_1);
  await knex('peer_review_aspect').insert(peer_review_aspect_1);
  await knex('action_points').insert(action_point_1);
  await knex('guided_prompt_answers').insert(prompt1);

  await knex('peer_review').insert(peer_review_2);
  await knex('peer_review_aspect').insert(peer_review_aspect_2);
  await knex('guided_prompt_answers').insert(prompt2);

  backup = mockDb.backup();

  const app = express();
  app.use(express.json());
  app.use('/reviews', routes);
  server = await app.listen(3003);
});

// Reset the database
afterEach(() => {
  backup.restore();
});

afterAll((done) => {
  server.close(() => {
    knex.destroy();
    done();
  });
});

describe('GET /reviews/:id', () => {
  test('gets an existing review as an authorised user', async () => {
    const response = await axios.get(`${url}/reviews/123`, {
      params: { user_id: peer_review_1.reviewee_id },
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.id).toEqual(peer_review_1.id);
    expect(resData.reviewee.id).toEqual(peer_review_1.reviewee_id);
    expect(resData.reviewer.id).toEqual(peer_review_1.reviewer_id);
    expect(resData.reason).toEqual(peer_review_1.reason);
    expect(resData.course).toEqual(peer_review_1.course);
    expect(resData.course_description).toEqual(peer_review_1.course_description);
    expect(resData.aspects[0].aspect_name).toEqual(peer_review_aspect_1.aspect_name);
    expect(resData.aspects[0].reviewee_comments).toEqual(peer_review_aspect_1.reviewee_comments);
    expect(resData.aspects[0].review).toEqual(peer_review_aspect_1.review);
    expect(resData.aspects[0].action_points[0].description).toEqual(action_point_1.description);
    expect(resData.guidedPrompts[0].guided_prompts_name).toEqual(
      'The teacher focusses on factual material'
    );
    expect(resData.guidedPrompts[0].prompt_answer).toEqual('Strongly Agree');
  });

  test('fails to get a review if user is not part of it', async () => {
    try {
      await axios.get(`${url}/reviews/123`, {
        params: { user_id: 999999999 },
      });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(403);
    }
  });

  it('returns 404 when getting invalid review', async () => {
    try {
      await axios.get(`${url}/reviews/999`);
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(404);
    }
  });
});

describe('GET /reviews', () => {
  it('get all requested reviews', async () => {
    const response = await axios.get(`${url}/reviews`, {
      params: { user_id: 555555555, type: 'reviewer' },
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(1);
    expect(resData[0].id).toEqual(peer_review_2.id);
    expect(resData[0].name).toEqual('John Doe');
    expect(resData[0].course).toEqual(peer_review_2.course);
    expect(dateFormat(resData[0].last_updated, 'yyyy-mm-dd')).toEqual(peer_review_2.last_updated);
    expect(resData[0].status).toEqual(peer_review_2.status);
  });

  it('get all my reviews', async () => {
    const response = await axios.get(`${url}/reviews`, {
      params: { user_id: 123456789, type: 'reviewee' },
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData[0].id).toEqual(peer_review_2.id);
    expect(resData[0].name).toEqual('Test User');
    expect(resData[0].course).toEqual(peer_review_2.course);
    expect(dateFormat(resData[0].last_updated, 'yyyy-mm-dd')).toEqual(peer_review_2.last_updated);
    expect(resData[0].status).toEqual(peer_review_2.status);

    expect(resData[1].id).toEqual(peer_review_1.id);
    expect(resData[1].name).toEqual('Jane Doe');
    expect(resData[1].course).toEqual(peer_review_1.course);
    expect(dateFormat(resData[1].last_updated, 'yyyy-mm-dd')).toEqual(peer_review_1.last_updated);
    expect(resData[1].status).toEqual(peer_review_1.status);
  });

  it('get all my reviews while no reviews exist', async () => {
    const response = await axios.get(`${url}/reviews`, {
      params: { user_id: 555555555, type: 'reviewee' },
    });
    expect(response.status).toBe(204);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(0);
  });

  it('get all my reviews with invalid user', async () => {
    const response = await axios.get(`${url}/reviews`, {
      params: { user_id: 333333333, type: 'reviewee' },
    });
    expect(response.status).toBe(204);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(0);
  });

  it('get all requested reviews with status', async () => {
    const response = await axios.get(`${url}/reviews`, {
      params: { user_id: 555555555, type: 'reviewer', status: 'Pending' },
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(1);
    expect(resData[0].id).toEqual(peer_review_2.id);
    expect(resData[0].name).toEqual('John Doe');
    expect(resData[0].course).toEqual(peer_review_2.course);
    expect(dateFormat(resData[0].last_updated, 'yyyy-mm-dd')).toEqual(peer_review_2.last_updated);
    expect(resData[0].status).toEqual(peer_review_2.status);
  });

  it('get all requested reviews with invalid parameter', async () => {
    try {
      await axios.get(`${url}/reviews`, {
        params: { user_id: 123456789, type: 'review' },
      });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(400);
    }
  });

  it('get all requested reviews with missing parameter', async () => {
    try {
      await axios.get(`${url}/reviews`, {
        params: { user_id: 123456789 },
      });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(400);
    }
  });
});

describe('POST /reviews', () => {
  it('creates a peer review request', async () => {
    const data = {
      reviewee_id: 123456789,
      reviewer_id: 987654321,
      reason: 'reason',
      course: 'course101',
      course_description: 'description',
      aspect_comments: [
        {
          aspect_name: 'Pace',
          reviewee_comments: 'comment',
        },
      ],
    };

    const response = await axios.post(`${url}/reviews`, data);

    // Check response is as expected
    expect(response.status).toBe(201);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.peer_review_id).toBeDefined();
    expect(resData.reviewee_id).toEqual(data.reviewee_id);
    expect(resData.reviewer_id).toEqual(data.reviewer_id);
    expect(resData.reason).toEqual(data.reason);
    expect(resData.course).toEqual(data.course);
    expect(resData.course_description).toEqual(data.course_description);
    expect(resData.aspect_comments[0].aspect_name).toEqual(data.aspect_comments[0].aspect_name);
    expect(resData.aspect_comments[0].reviewee_comments).toEqual(
      data.aspect_comments[0].reviewee_comments
    );
  });

  it('correctly stores a peer review request in database', async () => {
    const data = {
      reviewee_id: 123456789,
      reviewer_id: 987654321,
      reason: 'reason',
      course: 'course101',
      course_description: 'description',
      aspect_comments: [
        {
          aspect_name: 'Pace',
          reviewee_comments: 'comment',
        },
        {
          aspect_name: 'Student engagement',
          reviewee_comments: 'comment2',
        },
      ],
    };

    const response = await axios.post(`${url}/reviews`, data);
    expect(response.status).toBe(201);
    const peer_review_id = response.data.peer_review_id;

    // Check that peer review details is stored in peer_review table
    const peer_review_row = await knex
      .from('peer_review')
      .select('reviewee_id', 'reviewer_id', 'reason', 'course', 'course_description')
      .where({ id: peer_review_id })
      .first();

    const peer_review_data = { ...data };
    delete peer_review_data.aspect_comments;
    expect(peer_review_row).toEqual(peer_review_data);

    // Check that peer review aspect comments are stored in peer_review_aspect table
    const aspects_rows = await knex
      .from('peer_review_aspect')
      .select('aspect_name', 'reviewee_comments')
      .where({ peer_review_id });

    expect(aspects_rows).toEqual(data.aspect_comments);
  });
});

describe('PUT /reviews', () => {
  it('successfully change a peer review request', async () => {
    const data = {
      reviewee_id: 123456789,
      reviewer_id: 987654321,
      reason: 'reason',
      course: 'course101',
      course_description: 'description',
      aspect_comments: [
        {
          aspect_name: 'Pace',
          reviewee_comments: 'comment',
        },
        {
          aspect_name: 'Student engagement',
          reviewee_comments: 'comment2',
        },
      ],
      status: 'Draft',
      id: 123,
    };

    const response = await axios.put(`${url}/reviews`, data);
    expect(response.status).toBe(204);
    expect(response.data).toBeDefined();

    let requestDraft;
    await knex('peer_review')
      .where({ id: 123 })
      .then((result) => {
        requestDraft = result;
      });

    expect(requestDraft[0].id).toEqual(data.id);
    expect(requestDraft[0].course).toEqual(data.course);
    expect(requestDraft[0].course_description).toEqual(data.course_description);
    expect(requestDraft[0].status).toEqual(data.status);
    expect(requestDraft[0].reviewee_id).toEqual(data.reviewee_id);
    expect(requestDraft[0].reviewer_id).toEqual(data.reviewer_id);
  });

  // check invalid peer review id
  it('update the peer review request with invalid peer review id', async () => {
    const data = {
      reviewee_id: 123456789,
      reviewer_id: 987654321,
      reason: 'reason',
      course: 'course101',
      course_description: 'description',
      aspect_comments: [
        {
          aspect_name: 'Pace',
          reviewee_comments: 'comment',
        },
        {
          aspect_name: 'Student engagement',
          reviewee_comments: 'comment2',
        },
      ],
      status: 'Draft',
      id: 456,
    };

    expect.assertions(1);
    try {
      await axios.put(`${url}/reviews`, data);
    } catch (err) {
      expect(err.response.status).toBe(500);
    }
  });
});

describe('DELETE /reviews/:peer_review_id', () => {
  it('successfully deletes a peer review', async () => {
    const response = await axios.delete(`${url}/reviews/123`);
    expect.assertions(3);
    expect(response.status).toBe(204);
    expect(response.data).toBeDefined();

    try {
      await axios.get(`${url}/reviews/123`);
    } catch (err) {
      const { response } = err;
      expect(response.status).toBe(404);
    }
  });

  it('attempt to delete peer review with invalid peer review id', async () => {
    const response = await axios.delete(`${url}/reviews/456`);
    expect(response.status).toBe(204);
    expect(response.data).toBeDefined();
  });
});

describe('PUT /reviews/:peer_review_id', () => {
  it('successfully change the peer review status', async () => {
    const status = 'Complete';
    const response = await axios.put(`${url}/reviews/123`, {
      status,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data).toEqual(1);

    let peerReview1;
    await knex('peer_review')
      .where({ id: 123 })
      .then((result) => {
        peerReview1 = result;
      });
    expect(peerReview1[0].id).toEqual(peer_review_1.id);
    expect(peerReview1[0].course).toEqual(peer_review_1.course);
    expect(dateFormat(peerReview1[0].last_updated, 'yyyy-mm-dd')).toEqual(
      new Date().toISOString().slice(0, 10)
    );
    expect(peerReview1[0].status).toEqual('Complete');
  });

  it('change the peer review status with invalid peer review id', async () => {
    const status = 'Complete';
    const response = await axios.put(`${url}/reviews/23`, {
      status,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data).toEqual(0);
  });
});

describe('PUT /reviews/aspects/:peer_review_id', () => {
  it('update aspects for a peer review', async () => {
    const response = await axios.put(`${url}/reviews/aspects/234`, {
      aspects: [
        {
          aspect_name: 'General',
          review: 'test review 2',
          reviewee_comments: 'test comment 2',
          action_points: [],
        },
      ],
      status: 'Review Draft',
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    let peerReviewAspect1;
    await knex('peer_review_aspect')
      .where({ peer_review_id: 234 })
      .then((result) => {
        peerReviewAspect1 = result;
      });

    expect(peerReviewAspect1.length).toEqual(1);
    expect(peerReviewAspect1[0].aspect_name).toEqual('General');
    expect(peerReviewAspect1[0].review).toEqual('test review 2');
    expect(peerReviewAspect1[0].reviewee_comments).toEqual('test comment 2');
  });

  it('update aspects for a peer review with missing parameter', async () => {
    try {
      await axios.put(`${url}/reviews/aspects/234`, {
        aspects: [
          {
            review: 'review',
            reviewee_comments: 'test comment 2',
          },
        ],
        status: 'Review Draft',
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  it('add action point for a peer review', async () => {
    const response = await axios.put(`${url}/reviews/aspects/234`, {
      aspects: [
        {
          aspect_name: 'General',
          review: 'test review 2',
          reviewee_comments: 'test comment 2',
          action_points: [{ description: 'peer review 234 action point 1' }],
        },
      ],
      status: 'Review Draft',
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    let peerReview1ActionPoints;
    await knex('action_points')
      .where({ peer_review_id: 234 })
      .then((result) => {
        peerReview1ActionPoints = result;
      });

    expect(peerReview1ActionPoints.length).toEqual(1);
    expect(peerReview1ActionPoints[0].aspect_name).toEqual('General');
    expect(peerReview1ActionPoints[0].description).toEqual('peer review 234 action point 1');
  });

  it('edit action point for a peer review', async () => {
    const response = await axios.put(`${url}/reviews/aspects/123`, {
      aspects: [
        {
          aspect_name: 'Assessment',
          review: 'test review 2',
          reviewee_comments: 'test comment 2',
          action_points: [{ id: 1, description: 'change action point' }],
        },
      ],
      status: 'Review Draft',
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    let peerReview1ActionPoints;
    await knex('action_points')
      .where({ peer_review_id: 123 })
      .then((result) => {
        peerReview1ActionPoints = result;
      });

    expect(peerReview1ActionPoints.length).toEqual(1);
    expect(peerReview1ActionPoints[0].aspect_name).toEqual('Assessment');
    expect(peerReview1ActionPoints[0].description).toEqual('change action point');
  });

  it('delete action point for a peer review', async () => {
    const response = await axios.put(`${url}/reviews/aspects/123`, {
      aspects: [
        {
          aspect_name: 'Assessment',
          review: 'test review',
          reviewee_comments: 'test comment 2',
          action_points: [],
        },
      ],
      status: 'Review Draft',
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    let peerReview1ActionPoints;
    await knex('action_points')
      .where({ peer_review_id: 123 })
      .then((result) => {
        peerReview1ActionPoints = result;
      });

    expect(peerReview1ActionPoints.length).toEqual(0);
  });

  it('add new prompts to review with 1 update and 1 insert', async () => {
    const response = await axios.put(`${url}/reviews/aspects/123`, {
      aspects: [],
      prompts: [
        {
          peer_review_id: 123,
          guided_prompts_name: 'The teacher focusses on factual material',
          prompt_answer: 'Disagree',
        },
        {
          peer_review_id: 123,
          guided_prompts_name: 'The teacher caters for student diversity',
          prompt_answer: 'Strongly Agree',
        },
      ],
      status: 'Review Draft',
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    const promptsRes = await knex('guided_prompt_answers').where({ peer_review_id: 123 });
    expect(promptsRes.length).toEqual(2);
    expect(promptsRes[0].prompt_answer).toEqual('Disagree');
    expect(promptsRes[1].prompt_answer).toEqual('Strongly Agree');
  });
});
