const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middlewares
app.use(cors())
app.use(express())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7njjpna.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const productCollection = client.db("usedMart").collection("products");
        const categoryCollection = client.db("usedMart").collection("categories");


        //categories in home
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = categoryCollection.find(query);
            const productsByCategory = await result.toArray()
            res.send(productsByCategory);

        })

        // after clicking to the category
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = {category: id};
            const result = productCollection.find(query);
            const productsByCategory = await result.toArray()
            res.send(productsByCategory);

        })

        // get item by category
        app.get('/', async (req, res) => {
            const userSelectedCategory = req.query.category; 
            const query = {category: userSelectedCategory};
            const productsByCategory = await categoryCollection.findOne(query);
            res.send(productsByCategory)

        })

    }
    finally {

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})