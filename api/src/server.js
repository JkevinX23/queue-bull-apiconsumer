import express from "express";
import Queue from './app/lib/Queue'

import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import UserController from "./app/controllers/UserController";

const basePath = '/bull/admin';
const queues = Queue.queues.map(queue =>  new BullAdapter(queue.bull)); 

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(basePath)
createBullBoard({
    queues,
    serverAdapter
})

const app  = express();
app.use(express.json());
app.post('/users', UserController.store);

app.use(basePath, ({headers, next}, res) => headers.cafe == 25 ? next() :  res.status(401).json("Unauthorized"), serverAdapter.getRouter());

app.listen(3333, () => {
    console.log('Server runing on localhost:3333')
})