import express from 'express';
import { knex } from '../../db';

const router = express.Router();

// Gets all prompts and returns them
router.get('/', async (req, res) => {
  console.log('GET /prompts');
  try {
    const result = await knex.select().table('guided_prompts');
    return res.send(result);
  } catch (err) {
    return res.send(err);
  }
});

export default router;
