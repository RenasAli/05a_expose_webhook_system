import express from 'express';
import connection from './databaseManager/connection.js';


const app = express();
const PORT = 8088
app.use(express.json());

app.post('/webhooks/register', async (req, res) => {
    const { endpointUrl, events } = req.body;
    try {
        const [webhookResult] = await connection.execute(
            'INSERT INTO webhooks (endpoint_url) VALUES (?)',
            [endpointUrl]
        );
        const eventPromises = events.map(async (event) => {
            await connection.execute(
                'INSERT INTO webhook_events (webhook_id, event_type) VALUES (?, ?)',
                [webhookResult.insertId, event]
            );
        });
        await Promise.all(eventPromises);

        res.json({ success: true, id: webhookResult.insertId });
    } catch (error) {
        console.error('Error registering webhook:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/ping', async (req, res) => {
    try {
        console.log("console 1:")

        // Fetch registered webhooks with associated events from database
        const [webhooks] = await connection.execute('SELECT w.id AS webhook_id, w.endpoint_url, e.event_type FROM webhooks w LEFT JOIN webhook_events e ON w.id = e.webhook_id');
        
        // Group webhooks by ID and extract events
        console.log("console 2:",webhooks)
        const webhooksWithEvents = webhooks.reduce((acc, { webhook_id, endpoint_url, event_type }) => {
            if (!acc[webhook_id]) {
                acc[webhook_id] = { endpoint_url, events: [] };
                console.log("console 3:",acc[webhook_id])
            }
            if (event_type) {
                acc[webhook_id].events.push(event_type);
                console.log("console 4:",event_type)
            }
            return acc;
        }, {});
        console.log("console 5:")
        // Trigger POST request for each webhook with associated events
        const pingPromises = Object.values(webhooksWithEvents).map(async ({ endpoint_url, events }) => {
            console.log("console 6: ", endpoint_url, events)
            // Send a POST request to the webhook endpoint
            try {
                await fetch(endpoint_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ events })
                    
                });
                console.log("console 7: ")
                console.log(`Ping sent to webhook at ${endpoint_url} with events: ${events.join(', ')}`);
            } catch (error) {
                console.error(`Error sending ping to webhook at ${endpoint_url}:`, error);
            }
            console.log("console 8: ")
        });

        await Promise.all(pingPromises);

        // End the request without sending any response
        res.end();
    } catch (error) {
        console.error('Error pinging webhooks:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/webhooks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await connection.execute(
            'DELETE FROM webhooks WHERE id = ?',
            [id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error unregistering webhook:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.listen(PORT, () => console.log('Server is listening on port', PORT));

