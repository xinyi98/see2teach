import express from 'express';
import { knex } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('get /login');

  const { upi } = req.query;

  if (!upi) {
    return res.sendStatus(401);
  }

  knex('users')
    .where({ upi })
    .then((result) => {
      if (result.length != 0) {
        return res.send(result[0]);
      } else {
        // the user is not existed
        return res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

export default router;
