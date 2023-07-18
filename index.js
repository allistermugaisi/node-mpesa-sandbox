import express from 'express';
import cors from 'cors';

import paymentRoutes from './routes/payments.js';

const app = express();

app.use(express.json()); // used to parse JSON bodies
app.use(express.urlencoded({ limit: '1024mb', extended: true })); // parse URL-encoded bodies

// Catch / routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to Node Mpesa API sandbox endpoint!' });
});

app.use(cors('*'));
app.use('/api/v1/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listens on *:${PORT}`);
});
