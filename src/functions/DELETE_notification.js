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

app.http('deleteNotification', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection("notifications");

            const body = await request.json();
            const { notificationID } = body;

            if (!notificationID) {
                return {
                    status: 400,
                    body: "O campo 'notificationID' é obrigatório"
                };
            }

            const result = await collection.deleteOne({ notificationID: notificationID });

            if (result.deletedCount === 0) {
                return {
                    status: 404,
                    body: "Notificação não encontrada"
                };
            }

            return {
                status: 200,
                body: "Notificação excluída com sucesso"
            };
        } catch (error) {
            context.log.error("Erro ao excluir notificação:", error);
            return {
                status: 500,
                body: "Erro ao excluir notificação"
            };
        }
    }
});

