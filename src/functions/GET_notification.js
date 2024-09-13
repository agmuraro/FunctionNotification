const { app } = require('@azure/functions');
const { connectToMongoDB } = require('./mongoConnection');

app.http('getNotification', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection("notifications");

            const notificationID = request.query.notificationID;

            let notifications;
            if (notificationID) {
                notifications = await collection.findOne({ notificationID: notificationID });

                if (!notifications) {
                    return {
                        status: 404,
                        body: "Notificação não encontrada"
                    };
                }
            } else {
                notifications = await collection.find({}).toArray();
            }

            return {
                status: 200,
                body: JSON.stringify(notifications)
            };
        } catch (error) {
            context.log.error("Erro ao buscar notificações:", error);
            return {
                status: 500,
                body: "Erro ao buscar notificações"
            };
        }
    }
});




