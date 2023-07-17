import axios from 'axios';

// Mpesa credentials
const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const base_url = process.env.BASE_URL;

// Register urls
export const registerUrls = async (req, res) => {
	const { ShortCode } = req.body;

	try {
		const mpesa_endpoint =
			'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl'; // https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl

		const _access_token = await access_token();

		// Headers
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		config.headers['Authorization'] = `Bearer ${_access_token}`;

		// Request body
		const body = JSON.stringify({
			ShortCode: ShortCode,
			ResponseType: 'Complete',
			ConfirmationURL: base_url + '/api/v1/payments/c2b/confirmation',
			ValidationURL: base_url + '/api/v1/payments/c2b/validation',
		});

		const response = await axios.post(mpesa_endpoint, body, config);

		let data = await response.data;

		res.status(200).json({
			data,
			ShortCode,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json(error.response.data);
	}
};

// Callback URLS for validation and confimation
export const validateUrls = async (req, res) => {
	console.log(req.body);
	// Accept transaction API call and respond to safaricom server
	return {
		ResultCode: 0,
		ResultDesc: 'Accepted',
	};
};

// InitializeSTK for Lipa na Mpesa Online (Mpesa Express)
export const initializeStk = async (req, res) => {
	const { BusinessShortCode, Msisdn, Amount } = req.body;

	try {
		const mpesa_endpoint =
			'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'; // https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest

		const _access_token = await access_token();

		// Headers
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		config.headers['Authorization'] = `Bearer ${_access_token}`;

		const host_endpoint = base_url + '/api/v1/payments/stkpush-callback';

		const currentDate = new Date();
		const FormattedTimestamp = currentDate
			.toLocaleString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			})
			.replace(/[^\d]/g, '');

		let PassKey = process.env.PASS_KEY;

		const password = Buffer.from(
			BusinessShortCode + PassKey + FormattedTimestamp
		).toString('base64');

		// Request body
		const body = JSON.stringify({
			BusinessShortCode: BusinessShortCode,
			Password: password,
			Timestamp: FormattedTimestamp,
			TransactionType: 'CustomerPayBillOnline',
			PartyA: Msisdn,
			PartyB: BusinessShortCode,
			PhoneNumber: Msisdn,
			CallBackURL: host_endpoint,
			AccountReference: `Pay Trim-Time Barber account.`,
			TransactionDesc: 'Lipa na Mpesa Online Trim-Time',
			Amount: Amount,
		});

		const response = await axios.post(mpesa_endpoint, body, config);
		let data = response.data;

		res.status(200).json({
			data,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json(error.response.data);
	}
};

// Get access_token
const access_token = async () => {
	try {
		const mpesa_endpoint =
			'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; // https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials

		const response = await axios.get(mpesa_endpoint, {
			auth: {
				username: consumer_key,
				password: consumer_secret,
			},
		});

		let _access_token = await response.data.access_token;

		return _access_token;
	} catch (error) {
		console.error(error);
	}
};
