const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());


console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elekwkd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("allUsersDb").collection("allUsers");
    const  allTestCollection = client.db("allTest").collection("allTestCollection")

    app.get('/allTest', async (req, res) => {
      const result = await allTestCollection.find().toArray()

      res.send(result);
  })


  
  app.get("/testdetails/:_id", async (req, res) => {
    const id = req.params._id
    const query = {
        _id : new ObjectId(id)
    }
    const result = await allTestCollection.findOne(query)
    res.send(result)
    
})

app.post('/allTest', async (req, res) => {
  const job = req.body
  const result = await allTestCollection.insertOne(job)
 
  res.send(result);
})


  app.get("/alltest/:id", async (req, res) => {
            const id = req.params.id
            
            const query = {
                _id : new ObjectId(id)
            }
            const result = await allTestCollection.findOne(query)
            console.log(result);
            res.send(result)
            
        })
        
        
        /* delete a single job  */
        app.delete('/alltest/:id', async (req, res) => {
          const id = req.params.id
          console.log(id);
          const query = { _id:new ObjectId(id) }
          const result = await allTestCollection.deleteOne(query)
          console.log(result);
          res.send(result);
      }
      )

        //    app.put('/alltest/:id', async (req, res) => {
        //     const id = req.params.id
        //     const filter = {
        //         _id: new ObjectId(id)
        //     }
        //     const newjobs = req.body
        //     const options = {
        //         upsert: true,
        //     }
        //     const updatedJob = {
        //         $set: {
        //             jobBanner: newjobs.jobBanner,
        //             jobTitle: newjobs.jobTitle,
        //             category: newjobs.category,
        //             salaryRange: newjobs.salaryRange,
        //             short_description: newjobs.short_description,
        //             postingDate: newjobs.postingDate,
        //             applicationDeadline: newjobs.applicationDeadline,
        //             postedBy: newjobs.postedBy

        //         }
        //     }
        //     const result = await jobsCollection.updateOne(filter, updatedJob, options)
        //     console.log(result);
        //     res.send(result);
        // })




            

    
    
    
    
     // ----------------- users related api -----------------


     /* read user data */
     app.get('/users', async (req, res) => {
         const result = await userCollection.find().toArray();
         res.send(result);
     });


     /* sava new user data  */
     app.post('/users', async (req, res) => {
         const user = req.body;

         const query = { email: user.email }
         const existingUser = await userCollection.findOne(query);
         if (existingUser) {
             return res.send({ message: 'user already exists', insertedId: null })
         }
         const result = await userCollection.insertOne(user);
         res.send(result);
     });

       

     /* get single user by id */
     app.get("/users/:id", async (req, res) => {
         const id = req.params.id

         const query = {
             _id: new ObjectId(id)
         }
         const result = await userCollection.findOne(query)
         console.log(result);
         res.send(result)

     })





     /* update a single user  data */

     app.put('/users/:id', async (req, res) => {
         const id = req.params.id
         const filter = {
             _id: new ObjectId(id)
         }
         const newProduct = req.body
        console.log(newProduct);
         const updatedProfile = {
             $set: {
                 image_url: newProduct.image_url,
                 name: newProduct.name,
                 role: newProduct.role,
                 email: newProduct.email,
                 status: newProduct.status
             }
         }
         console.log(updatedProfile);
         const result = await userCollection.updateOne(filter, updatedProfile)
         console.log(result);
         res.send(result);
     })
        


     /* delete a iser  */
     app.delete('/users/:id', async (req, res) => {
         const id = req.params.id
         console.log(id);
         const query = { _id: new ObjectId(id) }
         const result = await userCollection.deleteOne(query)
         console.log(result);
         res.send(result);
     }
     )



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('daigonostic is running...')
})

app.listen(port, () =>{
    console.log(`daigonostic server is running on port ${port}`);
})