const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
//db user :taskmanagement
//password :haMTTyTVb8g4O9cV

const uri = "mongodb+srv://taskmanagement:haMTTyTVb8g4O9cV@cluster0.z8kj7tg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const taskCollection = client.db("taskManagement").collection("tasks");
    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      //console.log("trying to delete", id);
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const task = req.body;
      const option = { upsert: true };
      const updatedTask = {
        $set: {
          name: task.name,
          image: task.image,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedTask, option);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from task management systems.");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
