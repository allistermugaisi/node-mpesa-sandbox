import express from 'express';

import paymentRoutes from './routes/payments.js';

const app = express();

// Catch / routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Node Mpesa API sandbox endpoint!' });
});

app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listens on *:${PORT}`);
});
