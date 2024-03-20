import database from './connection.js';

(async () => {
    try {
        await database.execute(`
            DROP TABLE IF EXISTS webhooks;
        `);

        await database.execute(`
        CREATE TABLE webhooks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            endpoint_url VARCHAR(255) NOT NULL
        )
        `);

        await database.execute(`
        CREATE TABLE webhook_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            webhook_id INT,
            event_type VARCHAR(255) NOT NULL,
            FOREIGN KEY (webhook_id) REFERENCES webhooks(id) ON DELETE CASCADE
        )
        `);

    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await database.end();
    }
})();