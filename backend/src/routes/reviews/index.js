import express from 'express';
import { knex } from '../../db';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('POST /reviews');

  const { reviewee_id, reviewer_id, reason, course, course_description, aspect_comments, status } =
    req.body;

  try {
    const [peer_review_id] = await knex('peer_review')
      .insert({
        reviewee_id,
        reviewer_id,
        reason,
        course,
        course_description,
        status,
      })
      .returning('id');

    // the aspects in the incomming aspect_comments do not have peer review id associated with each aspect
    // add peer reivew id to each aspects
    if (aspect_comments && aspect_comments.length) {
      for (const aspect of aspect_comments) {
        aspect.peer_review_id = peer_review_id;
      }

      await knex('peer_review_aspect').insert(aspect_comments);
    }

    const result = {
      peer_review_id,
      reviewee_id,
      reviewer_id,
      reason,
      course,
      course_description,
      aspect_comments,
    };

    return res.status(201).header('location', `/review/${peer_review_id}`).json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  console.log('PUT /reviews');

  const {
    reviewee_id,
    reviewer_id,
    reason,
    course,
    course_description,
    aspect_comments,
    status,
    id,
  } = req.body;

  try {
    await knex('peer_review').where({ id }).update({
      reviewee_id,
      reviewer_id,
      reason,
      course,
      course_description,
      status,
      last_updated: knex.fn.now(),
    });

    if (aspect_comments && aspect_comments.length) {
      // modify the aspects to fit in the database
      for (const aspect of aspect_comments) {
        aspect.peer_review_id = id;
        delete aspect.action_points;
      }

      // get current peer review aspects
      const currentPeerReviewAspects = await knex('peer_review_aspect').where({
        peer_review_id: id,
      });

      // get current peer review aspect names
      let currentPeerReviewAspectsNameArray = currentPeerReviewAspects.map((a) => a.aspect_name);

      // get incoming aspect names
      let aspect_commentsNameArray = aspect_comments.map((a) => a.aspect_name);

      // delete unselected aspects
      // if the incoming aspect names does not include the current peer review aspect name
      // then this aspect name should be deleted
      for (const aspect of currentPeerReviewAspects) {
        if (!aspect_commentsNameArray.includes(aspect.aspect_name)) {
          await knex('peer_review_aspect')
            .where({
              peer_review_id: id,
              aspect_name: aspect.aspect_name,
            })
            .delete();
        }
      }

      // insert recently selected aspects
      // if the current peer review aspect names does not include the incoming aspect name
      // then this aspect name should be inserted
      for (const aspect of aspect_comments) {
        if (!currentPeerReviewAspectsNameArray.includes(aspect.aspect_name)) {
          await knex('peer_review_aspect').insert(aspect);
        }
      }
    }

    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.delete('/:peer_review_id', async (req, res) => {
  console.log('DELETE /reviews/peer_review_id');

  const { peer_review_id } = req.params;

  try {
    await knex('peer_review').where({ id: peer_review_id }).delete();
    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  console.log('GET /reviews');

  const { user_id, type, status } = req.query;

  // my reviews
  if (type === 'reviewee') {
    knex('peer_review')
      .select('peer_review.id', 'name', 'course', 'last_updated', 'status')
      .join('users', 'peer_review.reviewer_id', '=', 'users.id')
      .orderBy('last_updated', 'desc')
      .where({ reviewee_id: user_id })
      .modify(function (queryBuilder) {
        if (status) {
          queryBuilder.where('status', status);
        }
      })
      .then((result) => {
        if (result.length === 0) {
          return res.sendStatus(204);
        }
        return res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });

    // requested requests
  } else if (type === 'reviewer') {
    knex('peer_review')
      .select('peer_review.id', 'name', 'course', 'last_updated', 'status')
      .join('users', 'peer_review.reviewee_id', '=', 'users.id')
      .orderBy('last_updated', 'desc')
      .whereRaw(`LOWER(status) != 'draft'`)
      .andWhere({ reviewer_id: user_id })
      .modify(function (queryBuilder) {
        if (status) {
          queryBuilder.where('status', status);
        }
      })
      .then((result) => {
        if (result.length === 0) {
          return res.sendStatus(204);
        }
        return res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });
  } else {
    return res.sendStatus(400);
  }
});

router.get('/:peer_review_id', async (req, res) => {
  const { peer_review_id } = req.params;

  // TODO: Use JWT in auth header or something more secure
  const { user_id } = req.query;

  const result = await knex('peer_review').where({ id: peer_review_id }).first();

  if (result) {
    const { reviewee_id, reviewer_id } = result;

    // User is not part of this peer review
    if (reviewee_id != user_id && reviewer_id != user_id) {
      return res.sendStatus(403);
    }

    const users = await knex('users')
      .select('id', 'name', 'upi')
      .whereIn('id', [reviewee_id, reviewer_id]);

    // Set reviewee and reviewer information
    result.reviewee = users.find((u) => u.id == reviewee_id);
    result.reviewer = users.find((u) => u.id == reviewer_id);
    delete result.reviewee_id;
    delete result.reviewer_id;

    // Send only the reviewee's comments if reviewee is requesting and its a draft
    if (reviewee_id == user_id && result.status === 'review_draft') {
      console.log('here');
      result.aspects = await knex('peer_review_aspect')
        .where({ peer_review_id })
        .select('aspect_name', 'reviewee_comments');

      result.aspects.forEach((aspect) => {
        aspect.review = '';
        aspect.action_points = [];
      });

      result.guidedPrompts = [];
    } else {
      // Send all details if its not a draft.
      result.aspects = await knex('peer_review_aspect')
        .where({ peer_review_id })
        .select('aspect_name', 'reviewee_comments', 'review');

      if (result.aspects.length) {
        const actionPoints = await knex('action_points')
          .select('id', 'aspect_name', 'name', 'description')
          .where('peer_review_id', peer_review_id);

        // Create action_points field for each aspect
        result.aspects.forEach((aspect) => {
          const aspectActionPoints = actionPoints
            .filter((ap) => ap.aspect_name === aspect.aspect_name)
            .map((ap) => ({ id: ap.id, name: ap.name, description: ap.description }));

          aspect.action_points = aspectActionPoints;
        });
      }
      // adding prompt answers
      const guidedPrompts = await knex('guided_prompt_answers')
        .select('guided_prompts_name', 'prompt_answer')
        .where('peer_review_id', peer_review_id);

      result.guidedPrompts = guidedPrompts;
    }

    res.send(result);
  } else res.sendStatus(404);
});

router.put('/:peer_review_id', async (req, res) => {
  console.log('PUT /reviews/:peer_review_id');
  const { peer_review_id } = req.params;

  knex('peer_review')
    .where({ id: peer_review_id })
    .update({
      ...req.body,
      last_updated: knex.fn.now(),
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

router.put('/aspects/:peer_review_id', async (req, res) => {
  console.log('PUT /reviews/aspects/:peer_review_id');

  const { peer_review_id } = req.params;
  const { aspects, prompts, status } = req.body;

  let currentStatus;
  await knex('peer_review')
    .where({ id: peer_review_id })
    .then((result) => {
      currentStatus = result[0].status;
    });
  try {
    if (currentStatus != 'complete') {
      await knex('peer_review').where({ id: peer_review_id }).update({ status: status });
    }

    await knex('peer_review').where({ id: peer_review_id }).update({ last_updated: knex.fn.now() });

    // prompts
    // all prompts for peer review
    const savedPrompts = await knex('guided_prompt_answers').where({
      peer_review_id: peer_review_id,
    });

    if (prompts && prompts.length) {
      for (const prompt of prompts) {
        prompt.peer_review_id = peer_review_id;
        // if saved in DB update, else insert
        if (
          savedPrompts.some(
            (savedPrompt) => savedPrompt.guided_prompts_name === prompt.guided_prompts_name
          )
        ) {
          await knex('guided_prompt_answers')
            .where({
              peer_review_id: peer_review_id,
              guided_prompts_name: prompt.guided_prompts_name,
            })
            .update({ prompt_answer: prompt.prompt_answer });
        } else {
          await knex('guided_prompt_answers').insert(prompt);
        }
      }
    }

    for (const review of aspects) {
      if (review.aspect_name != undefined) {
        let reviewContent;
        await knex('peer_review_aspect')
          .where({ peer_review_id, aspect_name: review.aspect_name })
          .then((result) => {
            reviewContent = result[0].review;
          });

        // only update if the content changes
        if (reviewContent != review.review) {
          await knex('peer_review_aspect')
            .where({ peer_review_id, aspect_name: review.aspect_name })
            .update({ review: review.review });
        }
      } else {
        return res.sendStatus(400);
      }

      // get initial action points belong to the aspect
      let initialActionPointsIds = [];
      let actionPointDescription = [];
      await knex('action_points')
        .where({ peer_review_id, aspect_name: review.aspect_name })
        .then((result) => {
          initialActionPointsIds = result.map((ap) => ap.id);
          actionPointDescription = result.map((ap) => ap.description);
        });

      // there is action point associate with the aspect
      if (review.action_points.length != 0) {
        for (const actionPoint of review.action_points) {
          if (initialActionPointsIds.includes(actionPoint.id)) {
            let index = initialActionPointsIds.indexOf(actionPoint.id);
            // update existing modified action point
            if (actionPointDescription[index] != actionPoint.description) {
              await knex('action_points')
                .where({ id: actionPoint.id })
                .update({ description: actionPoint.description });
            }
          } else if (actionPoint.id == undefined) {
            // the incoming action points are the new added ones, post them to the database
            await knex('action_points').insert({
              peer_review_id,
              name: '',
              description: actionPoint.description,
              aspect_name: review.aspect_name,
            });
          }
        }
        // delete action points
        let incomingActionPointIds = review.action_points.map((ap) => ap.id).filter((ap) => ap);
        let deleteActionPointIds = initialActionPointsIds.filter(
          (id) => !incomingActionPointIds.includes(id)
        );
        for (const deleteActionPointId of deleteActionPointIds) {
          await knex('action_points').where({ id: deleteActionPointId }).del();
        }
      } else {
        // delete all existing action points of the aspect
        for (const deleteActionPointId of initialActionPointsIds) {
          await knex('action_points').where({ id: deleteActionPointId }).del();
        }
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export default router;
