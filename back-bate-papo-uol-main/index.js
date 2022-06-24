import express  from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const userSchema = joi.object({
	name: joi.string().min(1).max(30).required(),
	lastStatus: joi.number().required()
});

const mongoClient = new MongoClient(`${process.env.MONGO_URI}`);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("batepapo_uol_api");
});


server.post("/participants", async (req, res) => {
	const user = {...req.body, lastStatus: Date.now()}
	const validation = userSchema.validate(user, { abortEarly: true });
	
	if (validation.error) {
		console.log(validation.error.details)
		res.sendStatus(422)
		return
	}

	try {
		await db.collection("users").insertOne(user);
		res.sendStatus(201)
		return
		
	} catch (error) {
		console.error(error);
		res.sendStatus(500)
		return
	}
});

server.get("/participants", async (req, res) => {
	try {
		const allUsers =  await db.collection("users").find().toArray();
		res.send(allUsers).status(201)
		return

	} catch (error){
		console.error(error);
		res.sendStatus(500)
		return
	}
	res.sendStatus(422)
	return
});

server.post("/messages", (req, res) => {
	
});

server.get("/messages", (req, res) => {
	
});

server.post("/status", (req, res) => {
	
});

server.listen(5000, () => { console.log(process.env.MONGO_URI) })