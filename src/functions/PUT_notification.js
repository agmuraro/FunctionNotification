const { app } = require('@azure/functions');
const { connectToMongoDB } = require('./mongoConnection');
const { ObjectId } = require('mongodb');

app.http('updateNotification', {
    methods: ['PUT'],
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

            const result = await collection.updateOne(
                { notificationID: notificationID }, 
                { $set: { descrição: descrição } }  
            );

            if (result.matchedCount === 0) {
                return {
                    status: 404,
                    body: "Notificação não encontrada"
                };
            }

            return {
                status: 200,
                body: "Notificação atualizada com sucesso"
            };
        } catch (error) {
            context.log.error("Erro ao atualizar notificação:", error);
            return {
                status: 500,
                body: "Erro ao atualizar notificação"
            };
        }
    }
});

