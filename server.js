const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbURI = 'mongodb://martinstanchev96_db_user:MHl0NqN7QBSzgHX0@ac-tjmucu8-shard-00-00.zopymit.mongodb.net:27017,ac-tjmucu8-shard-00-01.zopymit.mongodb.net:27017,ac-tjmucu8-shard-00-02.zopymit.mongodb.net:27017/techhaven?replicaSet=atlas-k4cv7l-shard-0&ssl=true&authSource=admin';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

const Laptop = mongoose.model('Laptop', new mongoose.Schema({
    _id: String,
    title: String,
    shortDescription: String,
    fullDescription: String,
    price: Number,
    image: String
}));

const Purchase = mongoose.model('Purchase', new mongoose.Schema({
    customerName: String,
    customerAddress: String,
    laptopId: String,
    purchaseDate: { type: Date, default: Date.now }
}));

const Review = mongoose.model('Review', new mongoose.Schema({
    laptopId: String,
    comment: String,
    date: { type: Date, default: Date.now }
}));

app.get('/laptop:id.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'laptop-template.html'));
});

app.get('/api/laptops/:id', async (req, res) => {
    try {
        const laptop = await Laptop.findById(req.params.id);
        res.json(laptop);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.post('/api/purchases', async (req, res) => {
    try {
        await new Purchase(req.body).save();
        res.status(201).json({ message: 'Saved!' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.get('/api/reviews/:laptopId', async (req, res) => {
    try {
        const reviews = await Review.find({ laptopId: req.params.laptopId }).sort({ date: -1 });
        res.json(reviews);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.post('/api/reviews', async (req, res) => {
    try {
        await new Review(req.body).save();
        res.status(201).json({ message: 'Review Saved!' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.get('/api/admin/data', async (req, res) => {
    try {
        const laptops = await Laptop.find();
        const purchases = await Purchase.find().sort({ purchaseDate: -1 });
        
        const laptopStats = laptops.map(laptop => {
            const count = purchases.filter(p => p.laptopId === laptop._id).length;
            return { ...laptop.toObject(), purchaseCount: count };
        });
        
        res.json({ laptops: laptopStats, purchases: purchases });
    } catch (error) { res.status(500).json({ message: 'Error loading admin data' }); }
});

app.post('/api/laptops', async (req, res) => {
    try {
        await new Laptop(req.body).save();
        res.status(201).json({ message: 'Laptop Added' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.delete('/api/laptops/:id', async (req, res) => {
    try {
        await Laptop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Laptop Deleted' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.put('/api/laptops/:id', async (req, res) => {
    try {
        await Laptop.findByIdAndUpdate(req.params.id, { price: req.body.price });
        res.json({ message: 'Price Updated' });
    } catch (error) { res.status(500).json({ message: 'Error' }); }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});