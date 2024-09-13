const { app } = require('@azure/functions');
const { connectToMongoDB } = require('./mongoConnection');

app.http('createNotification', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const db = await connectToMongoDB();
            const collection = db.collection("notifications");

            const body = await request.json(); 

            const { notificationID, descrição } = body;

            if (!notificationID || !descrição) {
                return {
                    status: 400,
                    body: "Campos 'notificationID' e 'descrição' são obrigatórios"
                };
            }

            const newNotification = {
                notificationID: notificationID,
                descrição: descrição
            };

            await collection.insertOne(newNotification);
            return {
                status: 201,
                body: "Notificação criada com sucesso!"
            };
        } catch (error) {
            context.log.error("Erro ao criar notificação:", error);
            return {
                status: 500,
                body: "Erro ao criar notificação"
            };
        }
    }
});
