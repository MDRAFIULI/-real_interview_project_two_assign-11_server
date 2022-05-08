const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const itemCollection = client.db('assignmentEleven').collection('item');
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const inventories = await cursor.toArray()
            res.send(inventories);
        })
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await itemCollection.findOne(query);
            res.send(inventory);
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
