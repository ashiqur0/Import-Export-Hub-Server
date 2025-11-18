const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from server');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.edix7i0.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client 
        await client.connect();

        // create database
        const db = client.db('import_export_db');

        // create database collection
        const productsCollection = db.collection('products');
        const importedProductCollection = db.collection('imported_product');

        // products related api
        // create product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        // get latest product
        app.get('/latest-products', async (req, res) => {
            const cursor = productsCollection.find().sort({ created_at: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });

        // get all product
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // get individual product with id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // update product
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const { availableQuantity } = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    availableQuantity: availableQuantity
                }
            }
            const options = {};
            const result = await productsCollection.updateOne(query, update, options);
            res.send(result);
        });

        // import related api
        // create imported product
        app.post('/import', async (req, res) => {
            const importedProduct = req.body;
            const result = await importedProductCollection.insertOne(importedProduct);
            res.send(result);
        });

        // get imported product
        app.get('/import', async (req, res) => {
            const cursor = importedProductCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // delete my import
        app.delete('/import/:id', async(req, res) => { 
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await importedProductCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
})