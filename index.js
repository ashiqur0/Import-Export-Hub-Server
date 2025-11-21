const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const admin = require("firebase-admin");

// const serviceAccount = require("./import-export-hub-firebase-admin-key.json");
// index.js
const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// middleware
app.use(cors());
app.use(express.json());

// firebase token verification middleware
const verifyFirebaseAuthToken = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send({ message: 'unauthorized access1' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.token_email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'unauthorized access2' });
    }
}

const emailValidation = (req, res, next) => {
    const email = req.query.email;
    if (email) {
        if (email !== req.token_email) {
            return res.status(403).send({ message: 'forbidden access' });
        }
    }    
    next();
}

// public api
app.get('/', (req, res) => {
    res.send('Hello from express server ..');
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
        // create product || protected api || only logged in user can create a new product || protected api
        app.post('/products', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        // get latest product || public api
        app.get('/latest-products', async (req, res) => {
            const cursor = productsCollection.find().sort({ created_at: -1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });

        // get individual product with id || product details || see details
        // protected api || protected from client side || using protected route
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // get exported product || protected api || using exporter email
        app.get('/products', verifyFirebaseAuthToken, async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.exporter_email = email;
                if (email !== req.token_email) {
                    return res.status(403).send({ message: 'forbidden access' });
                }
            }

            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // get api || public api || to get all product
        app.get('/allproducts', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // put api to full update of a product || protected api
        app.put('/products/:id', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
            const id = req.params.id;
            const { productName, productPhoto, productPrice, productOrigin, productRating, productAvailableQuantity, exporter_email } = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    productName: productName,
                    productImage: productPhoto,
                    price: productPrice,
                    originCountry: productOrigin,
                    rating: productRating,
                    availableQuantity: productAvailableQuantity,
                    exporter_email: exporter_email
                }
            }

            const result = await productsCollection.updateOne(query, update);
            res.send(result);
        });

        // update product quantity || after import some quantity || protected api
        app.patch('/products/:id', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
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

        // delete exported product || protected api
        app.delete('/products/:id', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });

        // import related api
        // create imported product || with importer email as query parameter || protected api
        app.post('/import', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
            const importedProduct = req.body;
            const result = await importedProductCollection.insertOne(importedProduct);
            res.send(result);
        });

        // get imported product || protected api
        app.get('/import', verifyFirebaseAuthToken, async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.importer_email = email;
                if (email !== req.token_email) {
                    return res.status(403).send({ message: 'forbidden access' });
                }
            }

            const cursor = importedProductCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // delete my import || protected api
        app.delete('/import/:id', verifyFirebaseAuthToken, emailValidation, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await importedProductCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
})