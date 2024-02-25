import cluster from 'cluster';
import os from 'os';
import app from './app.js';
import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config()

const cpus = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers equal to the number of CPUs
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  // Listen for dying workers and fork a new one
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
    connectDB()
    .then(() =>(
        app.listen(process.env.PORT || 3000, () =>{
            console.log(`app is running on http://localhost:${process.env.PORT}`)
        })
    ))
    .catch((err) => (
        console.log('mongoDB error on index,js::', err)
    ))
    app.on("error", (error) =>{
        console.log("Error: ",error);
        throw error;
    })
}
