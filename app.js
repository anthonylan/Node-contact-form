const express = require('express');
const nodemailer = require('nodemailer');
const exBars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();

//Set template engine 
app.engine('handlebars', exBars());
app.set('view engine', 'handlebars');

//static files 
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact')
});

app.post('/send', (req, res) => {
  
    const output = `
     <h2> Message Request </h2>
     <p>Name: ${req.body.name} </p>
     <p>Name: ${req.body.company} </p>
     <p>Name: ${req.body.email} </p>
     <p>Name: ${req.body.phone} </p>
    
     <h2> Message </h2>
     <p> ${req.body.message} </p>
    
    `;
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'user@gmail.com', // generated ethereal user
            pass: 'userpassword' // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Contact form" <user@gmail.com>', // sender address
        to: 'reciever@gmail.com', // list of receivers
        subject: 'From node app', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Message sent'}); 
    });
})

app.listen(3000, () => {console.log('Server Started');
})