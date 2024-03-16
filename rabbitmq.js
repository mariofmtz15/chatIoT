const amqp = require('amqplib');

const url = 'amqp://ilnwxhmi:5o2WNdI3qV2BQpM4iHVrgMxpAFaA1wiB@gull.rmq.cloudamqp.com/ilnwxhmi'; // Replace with your actual credentials
const queueName = 'EQUIPO66'; // Replace with your actual queue name

// Function to handle connection and error management:
async function connect() {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false }); // Ensure queue exists
        console.log("Holi conectado");
        return { connection, channel };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        // Implement reconnection logic or handle the error appropriately
        process.exit(1); // Example: Exit the process if connection fails
    }
}
async function consume(channel) {
    channel.consume(queueName, (message) => {
        if (message !== null) {
            try {
                // Process the received message (replace with your logic)
                const messageContent = message.content.toString();
                console.log('Message received:', messageContent);

                // Send the message to all connected clients via WebSockets
                // io.emit('message', messageContent);

                // Acknowledge receipt of the message
                channel.ack(message);
            } catch (error) {
                console.error('Error processing message:', error);
                // Handle processing errors (e.g., retry, log the error)
            }
        }
    });
}
// Main function to start the consumer:
async function main() {
    try {
        const { connection, channel } = await connect();

        // Start consuming messages
        await consume(channel);

        // Keep the process running (optional, can be replaced with your application logic)
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Ensure proper closing, even if errors occur
        await channel.close();
        await connection.close();
    }
}

main();