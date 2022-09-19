const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const { readdirSync } = require("fs");
const path = require('path');
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();


const credential = {
    email: "admin@gmail.com",
    password: "123"
}

const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/products/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})
const upload = multer({ storage: fileStorageEngine });

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let category = require('./data/category.json');
let product = require('./data/products.json');
let header_item = require('./data/header.json');



// login user
router.post('/login', (req, res) => {
    if (req.body.email == process.env.login && req.body.password == process.env.passwd) {
        req.session.user = req.body.email;
        res.redirect('/admin/');
        res.end("Login Successful...!");
    } else {
        res.end("Invalid Username")
    }
});



router.post('/product', upload.single('file'), function(req, res, next) {
    const data = req.body;

    if (Object.prototype.hasOwnProperty.call(data, "editProduct")) {
        const index = product.findIndex(object => {
            return object.id === data.item_id;
        });

        if (product[index]) {
            if (product[index].name != data.name) {
                product[index].name = data.name;
            }
            if (product[index].category != data.cat && data.cat != undefined) {
                product[index].category = data.cat;
            }

            if (product[index].description != data.description) {
                product[index].description = data.description;
            }

            if (product[index].price != data.price) {
                product[index].price = data.price;
            }

            if (data.fav === 'on') {
                product[index].fav = true;
            } else {
                product[index].fav = false;
            }

            if (req.file) {
                product[index].image = `/assets/products/${req.file.filename}`;
            }

            fs.writeFileSync(`./data/products.json`, JSON.stringify(product));
        }
    }

    if (Object.prototype.hasOwnProperty.call(data, "addProduct")) {
        let product_add = {};

        product_add.id = uuidv4();
        product_add.name = data.name;
        product_add.category = data.cat;
        product_add.description = data.description;
        product_add.price = data.price;
        if (data.fav === 'on') {
            product_add.fav = true;
        }

        if (req.file) {
            product_add.image = `/assets/products/${req.file.filename}`;
        }

        product.push(product_add);
        fs.writeFileSync(`./data/products.json`, JSON.stringify(product));

    }

    if (Object.prototype.hasOwnProperty.call(data, "delProduct")) {
        const index = product.findIndex(object => {
            return object.id === parseInt(data.item_id);
        });

        product.splice(index, 1);
        fs.writeFileSync(`./data/products.json`, JSON.stringify(product));

    }
    res.redirect(303, `${req.originalUrl}`);
});

router.post('/category', (req, res) => {
    const data = req.body;

    if (Object.prototype.hasOwnProperty.call(data, "addCategory")) {

        let category_add = {};
        category_add.id = uuidv4();
        category_add.name = data.name;
        category_add.description = data.description;
        category_add.order = data.order;
        category_add.category = data.category;
        category_add.url = data.url;
        if (data.show) {
            category_add.show = true;
        } else {
            category_add.show = false;
        }

        category.push(category_add);
        fs.writeFileSync(`./data/category.json`, JSON.stringify(category));
    }

    if (Object.prototype.hasOwnProperty.call(data, "editCategory")) {
        const index = category.findIndex(object => {
            return object.id === data.item_id;
        });

        if (category[index]) {
            if (category[index].name != data.name) {
                category[index].name = data.name;
            }
            if (category[index].description != data.description) {
                category[index].description = data.description;
            }

            if (category[index].order != data.order) {
                category[index].order = data.order;
            }

            if (category[index].category != data.category) {
                category[index].category = data.category;
            }

            if (data.show === 'on') {
                category[index].show = true;
            } else {
                category[index].show = false;
            }

            fs.writeFileSync(`./data/category.json`, JSON.stringify(category));
        }
    }

    if (Object.prototype.hasOwnProperty.call(data, "delCat")) {
        const index = category.findIndex(object => {
            return object.id === data.item_id;
        });

        if (category[index]) {
            category.splice(index, 1);
            fs.writeFileSync(`./data/category.json`, JSON.stringify(category));
        };
    }

    res.redirect(303, `${req.originalUrl}`);
})

router.get('/', (req, res) => {
    if (req.session.user) {
        let category = require('./data/category.json');
        let product = require('./data/products.json');
        res.render('pages/dashboard/admin', { product: product, category: category, user: req.session.user })
    } else {
        res.redirect(303, `/login`);
    }
});

router.get('/product', (req, res) => {
    if (req.session.user) {
        let best_vente = require('./data/products.json');
        res.render('pages/dashboard/product', { product: product, category: category, user: req.session.user })
    } else {
        res.redirect(303, `/login`);
    }
});

router.get('/category', (req, res) => {
    if (req.session.user) {
        let category = require('./data/category.json');
        res.render('pages/dashboard/category', { product: product, category: category, user: req.session.user, header_item: header_item.sort((a, b) => b.category - a.category) })
    } else {
        res.redirect(303, `/login`);
    }
});


module.exports = router;