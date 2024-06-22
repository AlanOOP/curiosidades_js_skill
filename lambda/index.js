const Alexa = require('ask-sdk-core');

const GET_FACT_MSG_EN = "Here's a JavaScript fact: ";
const GET_FACT_MSG_ES = "Aquí tienes un dato curioso sobre JavaScript: ";

const dataEN = [
    'JavaScript was created in 10 days by Brendan Eich in 1995.',
    'JavaScript was originally called Mocha.',
    'JavaScript is not related to Java.',
    'JavaScript is supported by all modern browsers.',
    'JSON, the popular data format, is based on JavaScript.',
    'JavaScript can be used both on the frontend and backend.',
    'Node.js allows JavaScript to run on the server.',
    'JavaScript is the most popular programming language on GitHub.'
];

const dataES = [
    'JavaScript fue creado en 10 días por Brendan Eich en 1995.',
    'JavaScript inicialmente se llamó Mocha.',
    'JavaScript no está relacionado con Java.',
    'JavaScript es compatible con todos los navegadores modernos.',
    'JSON, el formato de datos popular, se basa en JavaScript.',
    'JavaScript se puede usar tanto en el frontend como en el backend.',
    'Node.js permite ejecutar JavaScript en el servidor.',
    'JavaScript es el lenguaje de programación más popular en GitHub.'
];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es') 
            ? '¡Hola! Bienvenido a Curiosidades de JavaScript. Puedes pedir un dato curioso diciendo "dame un dato curioso sobre JavaScript".'
            : 'Hello! Welcome to JavaScript Facts. You can ask for a fact by saying "give me a JavaScript fact".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FrasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FrasesIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const data = locale.startsWith('es') ? dataES : dataEN;
        const randomFact = data[Math.floor(Math.random() * data.length)];
        const speakOutput = locale.startsWith('es') ? GET_FACT_MSG_ES + randomFact : GET_FACT_MSG_EN + randomFact;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('Would you like to hear another fact?') // If you want to keep the session open
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es') 
            ? 'Puedes pedirme un dato curioso diciendo "dame un dato curioso sobre JavaScript".'
            : 'You can ask me for a fact by saying "give me a JavaScript fact".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es') ? '¡Adiós!' : 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es') 
            ? 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.'
            : 'Sorry, I had trouble doing what you asked. Please try again.';
        
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FrasesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .lambda();