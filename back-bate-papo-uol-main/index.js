import express  from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const userSchema = joi.object({
	name: joi.string().min(1).max(64).required(),
	lastStatus: joi.number().required()
});

const messageSchema = joi.object({
	from: joi.string().required(),
	to: joi.string().min(1).required(),
	text: joi.string().min(1).required(),
	type: joi.valid("message", "private_message").required(),
	time: joi.required()
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

	const existingName = await db.collection("users").findOne(req.body);
	if (existingName !== null) {
		console.log("Nome Existente")
		res.sendStatus(409)
		return
	}

	try {
		await db.collection("users").insertOne(user);
		await db.collection("messages").insertOne( { "from": user.name, "to": 'Todos', "text": 'entra na sala...', "type": 'status', "time": dayjs().format('HH:mm:ss') } )
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
});

server.post("/messages",  async (req, res) => {
	const from = req.headers.user;
	const message = {...req.body, from : from, time : dayjs().format('HH:mm:ss')}
	const validation = messageSchema.validate(message, { abortEarly: true });
	if (validation.error) {
		res.sendStatus(422)
		console.log(validation)
		return
	}

	try {
		await db.collection("messages").insertOne(message);
		res.sendStatus(201)
		return	
	} catch (error) {
		console.error(error);
		res.sendStatus(500)
		return
	}
});

server.get("/messages",  async (req, res) => {
	const user = req.headers.User;
	const limit = parseInt(req.query.limit);
	console.log(limit)
	try {
		const allMessages =  await db.collection("messages").find().toArray();
		const showMessages = allMessages.splice(-{limit})
		res.send(showMessages).status(201)
		return
	} catch (error){
		console.error(error);
		res.sendStatus(500)
		return
	}
});

server.post("/status",  async (req, res) => {
	const name = req.headers.user;

});

server.listen(process.env.PORT)