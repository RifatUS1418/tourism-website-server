const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgbbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('trip_Advisor');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');

        // GET services API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // Get Bokking API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookingServices = await cursor.toArray();
            res.send(bookingServices);
        })

        // My Order API
        app.get('/bookings', async (req, res) => {
            const query = { email: req.query.email }
            const cursor = bookingCollection.find(query);
            console.log(query);
            const myOrder = await cursor.toArray();
            console.log(myOrder);
            res.send(myOrder);
        })

        //Add Service POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        // Add Order API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
            console.log(req.body);
        });

        // Update API
        // app.put('/bookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id);
        //     const status = req.body;
        //     console.log(status);
        //     const query = { _id: Object(id) };
        //     console.log(query);
        //     // const result = await bookingCollection.updateOne(query);
        //     // res.json(result);
        // })

        // DELETE API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Trip Advisor Server is running');
});

app.listen(port, () => {
    console.log('listening to port', port);
});