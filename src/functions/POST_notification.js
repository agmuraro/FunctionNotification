const { app } = require('@azure/functions');
const { MongoClient } = require('mongodb');
const mongoDbUri = process.env.MONGODB_CONNECTION_STRING;
let client = null;

async function connectToMongoDB() {
    if (!client) {
        client = new MongoClient(mongoDbUri);
        await client.connect();
        console.log("Connected to MongoDB");
    }
    return client.db("ClusterEcommerce");
}

app.serviceBusQueue('createNotification', {
    methods: ['POST'],
    authLevel: 'anonymous',
    queueName: 'filaproduto', 
    connection: 'AzureWebJobsServiceBus', 
    handler: async (message, context) => {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection("notifications");

        const newNotification = {
            descrição: "Produto criado com sucesso!!!!!"
        };

        await collection.insertOne(newNotification);
        context.log("Notificação criada com sucesso:", newNotification);
    } catch (error) {
        context.log.error("Erro ao criar notificação:", error);
    }
}});
