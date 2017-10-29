const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

const config = require(`./config/${process.env.NODE_ENV}.js`)
const { ACCOUNT_SID, AUTH_TOKEN } = require('./config/sms')
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

console.log('hw')
client.messages
    .create({
        to: '+18319150199',
        from: '+18082014699',
        body: `${new Date(new Date().getTime()).toLocaleTimeString()} helpme app up and running with user ${process.env.USER}`
    })
    .then((message) => {console.log('sent a message')})

let currentCount = 0;

if(!config.PORT){
}

app.post('/sms', (req,res) => {
    const twiml = new MessagingResponse();
    twiml.message('This is a generic response');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})

app.use(express.static(__dirname + '/public'));

app.get('/api/counter', (req,res) => {
    res.json({
        counter: currentCount
    })
})

app.get('/api/decrement', (req,res) => {
    --currentCount;
    res.status(200);
    return;
})

app.get('/api/increment', (req,res) => {
    ++currentCount;
    res.status(200);
})

const server = app.listen(config.PORT, () => {
    console.log(`server running on ${config.PORT}`)
})