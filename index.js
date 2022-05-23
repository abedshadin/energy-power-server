const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require("express/lib/response");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkwoc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const toolCollection = client.db("energy-power").collection("tools");
    const reviewCollection = client.db("energy-power").collection("reviews");
    const orderedCollection = client.db("energy-power").collection("ordered");
    const userCollection = client.db("energy-power").collection("users");

    //get all tools
    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
     
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.put('/user/admin/:email',async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email};
      const requester = req.body;
      
      const requestAccount = await userCollection.findOne({email: requester});
      if(requestAccount.role == 'admin'){

        const updateDoc = {
          $set:{role:'admin'},
        }
        const result = await userCollection.updateOne(filter,updateDoc);
        res.send(result);
      }
      else{
        res.status(403).send({message:'forbidden'});
      }
  
    })

    //get single tool details
    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tools = await toolCollection.findOne(query);
      res.send(tools);
    });

    //update single item
    app.put("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const doc = {
        $set: req.body,
      };
      const tools = await toolCollection.updateOne(query, doc, options);
      res.send(tools);
      console.log(doc);
    });

    // post ordered items
    app.post("/ordered", async (req, res) => {
      const newOrder = req.body;
      const result = await orderedCollection.insertOne(newOrder);
      res.send(result);
    });
    // post review items
    app.post("/reviews", async (req, res) => {
      const newOrder = req.body;
      const result = await reviewCollection.insertOne(newOrder);
      res.send(result);
    });

    //myorders
    app.get("/myorders", async (req, res) => {
      const email = req.query.email;
      const query = { user_email: email };
      const cursor = orderedCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //delete order
    app.delete("/myorders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderedCollection.deleteOne(query);
      res.send(result);
    });

    //get all reviews
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
