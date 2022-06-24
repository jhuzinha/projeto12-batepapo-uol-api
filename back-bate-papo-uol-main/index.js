import express  from "express";
import { MongoClient } from "mongodb";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());


server.post("/participants", (req, res) => {
	
});

server.get("/participants", (req, res) => {
	
});

server.post("/messages", (req, res) => {
	
});

server.get("/messages", (req, res) => {
	
});

server.post("/status", (req, res) => {
	
});

server.listen(5000, () => { console.log(process.env.MONGO_URI) })