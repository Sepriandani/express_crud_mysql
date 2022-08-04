var express = require('express');
var router = express.Router();
const Validator = require("fastest-validator");

const { Product } = require('../models');

const v = new Validator();

// tampilkan semua data
router.get('/', async (req, res) => {
    const products = await Product.findAll();
    return res.json(products);
});

// tampilkan data berdasarkan id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByPk(id);
    return res.json(product || {});
});

// create data
router.post('/', async (req, res) => {
    const schema = {
        name: 'string',
        brand : 'string',
        description: 'string|optional'
    }

    const validate = v.validate(req.body, schema);

    if(validate.length) {
        return res.status(400).json(validate);
    }

    const product = await Product.create(req.body);

    res.json(product)

});

// update data
router.put('/:id', async (req, res) => {
    //ambil id di params
    const id = req.params.id;

    //cari databse sesuai id
    let product = await Product.findByPk(id);

    // cek apakah data ditemukan atau tidak
    // kalau tidak kirim pesan error
    if(!product){
        return res.json({ massage: 'Product not  found' });
    }

    // setelah data didapatkan
    // rule
    const schema = {
        name: 'string|optional',
        brand: 'string|optional',
        description: 'string|optional'
    }

    // validasi input dari api
    const validate = v.validate(req.body, schema);

    // jika data yang dikirimkan tidak sesuai rule
    if(validate.length) {
        return res.status(400).json(validate);
    }

    // jika data benar maka ubah data didatabase
    product = await product.update(req.body);
    res.json(product);

});

// hapus data
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByPk(id);

    if(!product){
        return res.json({ massage: 'Product not  found' });
    }

    await product.destroy();

    res.json({
        message: 'Product is deleted'
    })
});

module.exports = router;