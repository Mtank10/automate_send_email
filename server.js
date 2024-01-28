const SibApiV3Sdk = require('@getbrevo/brevo');
const express = require('express')
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set up ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Function to send automation email using Brevo Api
async function sendAutomationEmail(name,email){
        // Configure API key authorization: apiKey
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.API_KEY;

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "My {{params.subject}}";
        sendSmtpEmail.htmlContent="<html><body><h1>Hey {{params.name}} Thanks for subscribing..</h1></body></html>"
        sendSmtpEmail.sender = { "name": "Shivam Raj", "email": "rajshivam691@gmail.com" };
        sendSmtpEmail.to = [{ "email": email, "name": name }];
        sendSmtpEmail.headers={ "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params={ "subject": "Automated Email", "name": name };
        
        apiInstance.sendTransacEmail(sendSmtpEmail).then(data => {
            console.log('Api called succfully. Return data: ' + JSON.stringify(data));
        },function(error) {
            console.error(error);
        })
}       

app.get('/', (req, res) => {
    res.render('form');
})

app.post('/submit',(req,res)=>{
    try{
        const {name,email}=req.body;
        //validate inpute fields
        if(!name || !email){
            return res.status(400).json({error:'Name and email are required'})
        }
        //schedule sending automation email after one minute 
        setTimeout(() => {
            sendAutomationEmail(name,email)    
        },6000);
       // return res.status(200).json({message:'Email sent successfully'})
       return res.render('success');
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
})


app.listen(3000, () => console.log('Server running on port 3000'))


module.exports = app;
