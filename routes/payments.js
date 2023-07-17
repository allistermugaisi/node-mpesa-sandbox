import express from 'express';

import {
	registerUrls,
	validateUrls,
	// confirmUrls,
	// simulateC2B,
	initializeStk,
	// initializeStkCallback,
} from '../controllers/payments.js';

const router = express.Router();

router.post('/register-urls', registerUrls);
router.post('/c2b/validation', validateUrls);
// router.post('/c2b/confirmation', confirmUrls);
// router.post('/c2b/simulate', simulateC2B);
router.post('/stkpush', initializeStk);
// router.post('/stkpush-callback', initializeStkCallback);

export default router;
