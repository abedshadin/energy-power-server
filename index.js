const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkwoc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
      await client.connect();
      const toolCollection = client.db("energy-power").collection("tools");


      app.get('/tools', async(req,res)=>{
        const query = {};
        const tools = await toolCollection.findOne(query);
        res.send(tools);
      })
      
     
    } finally {
  
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})