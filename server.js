const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { readdirSync } = require("fs");
const path = require('path');
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
var server = require('http').createServer(app);
require('dotenv').config()


const router = require('./router');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');


app.use('/static', express.static(path.join(__dirname, 'public/styles')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/data', express.static(path.join(__dirname, 'data')))
app.use('/script', express.static(path.join(__dirname, 'script')))


app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use('/admin', router);

app.get('/', renderHome);
app.get('/login', renderLogin)
app.get('/conditions', renderCond);
app.get('/mentions', renderMentions);
app.get('/contact', renderContact);
app.get('/success', renderSuccess)

let category = require('./data/category.json');
let product = require('./data/products.json');
let header_item = require('./data/header.json');


category.forEach(cat => {
    app.get(`/${cat.url}`, (req, res) => {
        res.render('pages/biscuits/biscuits', {
            product: product,
            category: category,
            user: req.session.user,
            name: cat.name
        })
    })
})


function renderHome(req, res) {
    res.render('pages/home', {
        category: category,
        product: product,
        user: req.session.user
    })
}

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

app.post('/contact', function(req, res) {
    const data = req.body;
    if (Object.prototype.hasOwnProperty.call(data, "sendMail")) {

        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'morganjcqt@gmail.com',
                pass: 'fqsb uerr bagv syml'
            }
        }));

        console.log(data);
        var mailOptions = {
            from: req.body.email,
            to: process.env.MAIL,
            subject: 'Demande Plaisirs-Fondants',
            text: `Nom: ${data.name[0]} / Prenom: ${data.name[1]}\nMail: ${data.email}\nN°Siret ${data.siret}\n
            ${data.demande}`,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect('/success');
            }
        });

    }
})

function renderLogin(req, res) {
    if (typeof req.session != 'undefined') {
        if (typeof req.session.user === 'undefined') {
            res.render('pages/login', {
                category: category,
                product: product,
                user: req.session.user
            })
        } else if (req.session.user) {
            res.render('pages/dashboard/admin', {
                category: category,
                product: product,
                user: req.session.user
            })
        }
    }
}

function renderCond(req, res) {
    res.render('pages/conditions', {
        category: category,
        product: product,
        user: req.session.user
    })
}

function renderMentions(req, res) {
    res.render('pages/mentions', {
        category: category,
        product: product,
        user: req.session.user
    })
}

function renderContact(req, res) {
    res.render('pages/contact', {
        category: category,
        product: product,
        user: req.session.user
    })
}

function renderSuccess(req, res) {
    res.render('pages/success', {
        category: category,
        product: product,
        user: req.session.user
    })
}

server.listen(process.env.PORT, () => {
    console.log('server started');
});