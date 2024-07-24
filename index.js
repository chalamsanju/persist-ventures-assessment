import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const walletAddress = '4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQk';

const SOLANA_API_URL = `https://api.mainnet-beta.solana.com`;

const getTransactions = async (address) => {
    const requestBody = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getConfirmedSignaturesForAddress2",
        "params": [
            address,
            {
                "limit": 10
            }
        ]
    };

    try {
        const response = await fetch(SOLANA_API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        throw error;
    }
};

app.get('/transaction', async (req, res) => {
    try {
        const transactions = await getTransactions(walletAddress);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching transaction data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
