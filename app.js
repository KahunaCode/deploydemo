const express = require('express');
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

const config = require(`./config/${process.env.NODE_ENV}.js`)
const { ACCOUNT_SID, AUTH_TOKEN, ADMINS, RESCUERS } = require('./config/sms')
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

console.log('hw')


for (let i = 0; i < ADMINS.length; i++) {
    setTimeout(function(){
        client.messages
        .create({
            to: ADMINS[i],
            from: '+18082014699',
            body: `${new Date(new Date().getTime()).toLocaleTimeString()}- ${process.env.USER} started the helpme app`
        })
        .then((message) => {console.log(`sent a message to ${ADMINS[i]}`)})
    }, i * 1000);
}

app.post('/sms/rescue', (req, res) => {
    //
    //dummy DB query for helpers retuns phone #'s to text. using RESCUERS in sms.js for tests
    //
    
    console.log(RESCUERS);
    for (let i = 0; i < RESCUERS.length; i++) {
        setTimeout(function(){
            client.messages
            .create({
                to: RESCUERS[i],
                from: req.headers.helpee,
                location: req.headers.location,
                body: `${from} is at ${location} and needs help!`
            })
            .then((message) => {console.log(`sent a message to ${RESCUERS[i]}`)})
        }, i * 1000);
    }
    
    // const twiml = new MessagingResponse();
    // helpee = req.headers.helpee,
    // location = req.headers.location,
    // console.log(`${helpee} is at ${location} and needs help!`);
    // console.log("headers", req.headers)
    // console.log(req)
    // twiml.message(`${helpee} is at ${location} and needs help!`);
    // res.writeHead(200, {'Content-Type': 'text/xml'});
    // res.end(twiml.toString());
})

// client.messages
//     .create({
//         to: '+18319150199',
//         from: '+18082014699',
//         body: `${new Date(new Date().getTime()).toLocaleTimeString()} helpme app up and running with user ${process.env.USER}`
//     })
//     .then((message) => {console.log('sent a message')})

let currentCount = 0;

if(!config.PORT){
}

app.post('/sms', (req,res) => {
    const twiml = new MessagingResponse();
    twiml.message('This is a generic response');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})

//this a helpme request for assistance
app.post('/sms/chat', twilio.webhook({validate: false}),(req, res) => {
    let from = req.body.From;
    let to = req.body.To;
    let body = req.body.Body;

    gatherOutgoingNumber(from, to)
    .then(function (outgoingPhoneNumber) {
        let MessagingResponse = new MessagingResponse();
        MessagingResponse.message({ to: outgoingPhoneNumber}, body);
        res.type('text/xml')
        res.send(MessagingResponse.toString());
    })
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