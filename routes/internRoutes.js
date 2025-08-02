import express from 'express';
const router = express.Router();

import { getIntern, createIntern, getLeaderboard, createLeaderboardEntry } from '../controllers/internController.js';

router.route('/intern').get(getIntern).post(createIntern);
router.route('/leaderboard').get(getLeaderboard).post(createLeaderboardEntry);

export default router;
