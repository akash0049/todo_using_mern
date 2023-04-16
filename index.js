const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const totalCPUs = require("os").cpus().length;

// const client = require('./redis_config.js');
const mongoose = require('mongoose');
const userRoutes = require('./routes/api/user_routes.js')
const todoRoutes = require('./routes/api/todo_routes.js')

require('dotenv/config');

const PORT = process.env.PORT || 8899;
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

// Setting Up Cluster Environment 
if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {

    // App initialization
    const app = express();

    console.log(`Worker ${process.pid} started`);

    // JSON Parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Default Server API
    app.get("/", (req, res) => res.send("<h1>Hello from Electroverse!!<h1>"));

    // Setting Routes
    app.use('/api', userRoutes);
    app.use('/api', todoRoutes);

    mongoose
        .connect(MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            app.listen(PORT, async () => {
                console.log(`Server up & running on port ${PORT} and connected to mongoDB`);
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
}