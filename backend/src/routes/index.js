const express = require('express');

const router = express.Router();

import reviews from './reviews';
import login from './login';
import users from './users';
import aspects from './aspects';
import prompts from './prompts';

router.use('/reviews', reviews);
router.use('/login', login);
router.use('/users', users);
router.use('/aspects', aspects);
router.use('/prompts', prompts);

export default router;
