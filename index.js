const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.ASSIGNMENTELEVEN_USER}:${process.env.ASSIGNMENTELEVEN_PASSWORD}@cluster0.5tzt8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const inventoryCollection = client.db('assignmentEleven').collection('inventory');
        app.get('/manageInventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray()
            res.send(inventories);
        });
        app.get('/manageInventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        });
        //insert item
        app.post('/manageInventory', async (req, res) => {
            const newItem = req.body;
            const result = await inventoryCollection.insertOne(newItem);
            res.send(result);
        })
        //delete one inventory
        app.delete('/manageInventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);

        })
        //get inventory by user email
        app.get('/myItems', /* verifyJWT, */ async (req, res) => {
            console.log('this rrrreeeeqqq', req);
            const decodedEmail = req?.decoded?.email;
            console.log('decodedEmail', decodedEmail);
            const email = req?.query?.email;
            console.log('this eamil', req?.query?.email);
            /* if (email === decodedEmail) {
                const query = { email: email };
                const cursor = await inventoryCollection.find(query);
                const myItems = await cursor.toArray();
                res.send(myItems);
            } */
            const query = { email: email };
            const cursor = await inventoryCollection.find(query);
            const myItems = await cursor.toArray();
            res.send(myItems);


        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello world')
});
app.listen(port, (req, res) => {
    console.log('listening to port', port);
})
