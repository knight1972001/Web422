// ################################################################################
// 1. Setup the web service 
// - import express, cors, mongoose, etc
// - configure the app variable
// ################################################################################
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config({path:"./config/keys.env"});

app.get("/", (req, res) =>{
    res.send({message: "API Listening"});
});

// ################################################################################
// 2. Importing the restaurantDB module and instanting a db variable
// ################################################################################
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB(process.env.MONGO_DB_CONNECTION_KEY);

db.initialize().then(()=>{
        app.listen(HTTP_PORT, ()=>{
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err)=>{
        console.log("DB cannot be initialized: "+err);
    });
    
// ################################################################################
// 3. Endpoints
// ################################################################################
app.post("/api/restaurants",(req, res)=>{
    const input=req.body;
    console.log(input);
    db.addNewRestaurant(input).then((data)=>{
        res.status(200).send(data);
    }).catch((error)=>{
        res.status(500).send("There are an error: "+error);
    })
});

app.get("/api/restaurants", (req, res) =>{
    const query=req.query;
    console.log(query);
    console.log(`-----------`);
    console.log(query.page);
    console.log(query.perPage);
    console.log(query.borough);

    db.getAllRestaurants(query.page, query.perPage, query.borough).then((data)=>{
        if(data == null){
            res.status(200).send({message: "No Restaurants in DB"})
        }else{
            res.status(200).send(data);
        }
    }).catch((error)=>{
        res.status(500).send(error);
    });
});

app.get("/api/restaurants/:_id", (req, res)=>{
    const params=req.params._id;
    console.log(params);
    

    db.getRestaurantById(params).then((data)=>{
        if(data!=null){
            res.status(200).send(data);
        }else{
            res.status(200).send({message:`There is not restaurant #id ${params}`});
        }
    }).catch((error)=>{
        res.status(500).send("Error: "+error);
    })
});

app.put("/api/restaurants/:_id", (req, res)=>{
    const params=req.params._id;
    console.log(params);
    console.log("Body");
    const input=req.body;
    console.log(input);
    db.getRestaurantById(params).then((data)=>{
        if(data!=null){
            db.updateRestaurantById(input, params).then((data)=>{
                res.status(200).send(data);
            }).catch((error)=>{
                res.status(500).send("Error: "+error);
            })
        }else{
            res.status(200).send({message:`There is not restaurant #id ${params}`});
        }
    }).catch((error)=>{
        res.status(500).send("Error: "+error);
    })
});

app.delete("/api/restaurants/:_id", (req, res)=>{
    const params=req.params._id;
    console.log(params);
    db.getRestaurantById(params).then((data)=>{
        if(data!=null){
            db.deleteRestaurantById(params).then((data)=>{
                res.status(204).send(data);
            }).catch((error)=>{
                res.status(500).send(error);
            });
        }else{
            res.status(200).send({message:`There is not restaurant #id ${params}`});
        }
    }).catch((error)=>{
        res.status(500).send("Error: "+error);
    })
})



// ################################################################################
// 4. Tell the app to start listening for requests
// ################################################################################
const HTTP_PORT=process.env.PORT;

