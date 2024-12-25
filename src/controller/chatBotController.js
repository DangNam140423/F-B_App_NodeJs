const { SessionsClient } = require('@google-cloud/dialogflow');
import ticketServices from '../services/ticketServices';
const path = require('path');
require('dotenv').config();

function extractData(parameters) {
    return {
        date: parameters.date?.stringValue || null,
        time: parameters.time?.stringValue || null,
        arrTable: parameters.arrTable?.listValue?.values.map(v => v.stringValue || v.numberValue) || [],
        kid: parameters.kid?.stringValue || 0,
        adults: parameters.adults?.numberValue || 0,
        actionOriginal: parameters['action.original']?.stringValue || 'mua vé',
        fitdata: parameters.fitdata?.boolValue || false,
        timeType: parameters.timeType?.stringValue || null,
    };
}

let handleChatBot = async (req, res) => {
    const projectId = 'yesil-ibnv';
    const sessionId = `dfMessenger-${req.user.id}`;
    const languageCode = 'vi';
    const clientOptions = {
        credentials: {
            // private_key: require(path.join(__dirname, '../../yesil-ibnv-40e48dc7cb03.json')).private_key,
            // client_email: require(path.join(__dirname, '../../yesil-ibnv-40e48dc7cb03.json')).client_email,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.CLIENT_EMAIL,
        }
    };
    const sessionClient = new SessionsClient(clientOptions);
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);


    const { textChat } = req.body;
    const infoUser = req.user;
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: textChat,
                languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        const parameters = extractData(responses[0].queryResult?.outputContexts?.[0]?.parameters?.fields || {});
        const tag = responses[0].queryResult.intent.displayName;
        const contextName = responses[0].queryResult?.outputContexts?.[0]?.name.split("/")[6];
        const objectResult = {
            textOfYesil: result.fulfillmentText
        }
        switch (contextName) {
            case 'ticket_booking':
                const dataTicket = {
                    timeType: parameters.timeType,
                    date: parameters.date,
                    phoneCustomer: infoUser.phone,
                    nameCustomer: infoUser.fullName,
                    email: infoUser.email,
                    numberTicketType: {
                        numberAdultBest: parameters.adults,
                        numberKidBest: parameters.kid
                    },
                    arrIdTable: parameters.arrTable,
                    fitdata: parameters.fitdata
                }
                objectResult.param = dataTicket.fitdata ? dataTicket : null;
                break;
            default:
                break;
        }
        res.json(objectResult);
    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error processing your request');
    }
}

module.exports = {
    handleChatBot
}