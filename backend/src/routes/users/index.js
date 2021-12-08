import express from 'express';
import { knex } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('get /users');
  knex('users')
    .select()
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

export default router;
