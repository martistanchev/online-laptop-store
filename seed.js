const mongoose = require('mongoose');

const dbURI = 'mongodb://martinstanchev96_db_user:MHl0NqN7QBSzgHX0@ac-tjmucu8-shard-00-00.zopymit.mongodb.net:27017,ac-tjmucu8-shard-00-01.zopymit.mongodb.net:27017,ac-tjmucu8-shard-00-02.zopymit.mongodb.net:27017/techhaven?replicaSet=atlas-k4cv7l-shard-0&ssl=true&authSource=admin';

const laptopSchema = new mongoose.Schema({
    _id: String,
    title: String,
    shortDescription: String,
    fullDescription: String,
    price: Number,
    image: String
});
const Laptop = mongoose.model('Laptop', laptopSchema);

const laptops = [
    {
        _id: '1',
        title: 'Lenovo ThinkPad X1 Carbon',
        shortDescription: 'The ultimate lightweight business and coding machine.',
        fullDescription: 'Equipped with an Intel Core i7 and 32GB of RAM, the X1 Carbon features the legendary ThinkPad keyboard and a stunning 14-inch display, all wrapped in a carbon-fiber chassis.',
        price: 1899.00,
        image: '/images/laptop1.jpg'
    },
    {
        _id: '2',
        title: 'Lenovo Legion Pro 7i',
        shortDescription: 'Unmatched gaming performance with advanced cooling.',
        fullDescription: 'Featuring an RTX 4080 and an Intel Core i9, the Legion Pro 7i dominates high-end gaming and heavy 3D rendering with AI-tuned thermal performance.',
        price: 2499.00,
        image: '/images/laptop2.jpg'
    },
    {
        _id: '3',
        title: 'Lenovo Yoga 9i',
        shortDescription: 'Premium 2-in-1 versatility with a 4K OLED touchscreen.',
        fullDescription: 'Flip it into tablet mode for drawing or use it as a standard laptop. The Yoga 9i brings a beautiful 4K OLED screen and an integrated Bowers & Wilkins soundbar.',
        price: 1599.00,
        image: '/images/laptop3.jpg'
    },
    {
        _id: '4',
        title: 'Lenovo IdeaPad Slim 5',
        shortDescription: 'Perfect balance of performance and affordability for students.',
        fullDescription: 'A highly portable laptop featuring all-day battery life, a comfortable keyboard, and enough processing power to handle daily multitasking, research, and coding assignments.',
        price: 799.00,
        image: '/images/laptop4.jpg'
    },
    {
        _id: '5',
        title: 'Lenovo ThinkBook 16p',
        shortDescription: 'Built for creators and heavy workstation tasks.',
        fullDescription: 'A massive 16-inch color-accurate display paired with dedicated NVIDIA graphics makes the ThinkBook 16p the ideal mobile workstation for video editing and design.',
        price: 1450.00,
        image: '/images/laptop5.jpg'
    }
];

mongoose.connect(dbURI)
    .then(async () => {
        console.log('Connected to MongoDB. Clearing old data...');
        await Laptop.deleteMany({});
        console.log('Inserting new laptops...');
        await Laptop.insertMany(laptops);
        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });