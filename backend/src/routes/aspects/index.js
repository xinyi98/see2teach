import express from 'express';
import { knex } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('get /aspects');

  // the general aspect is default
  // so do not include it in the response
  knex('aspects')
    .whereNot({ name: 'General' })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

export default router;
