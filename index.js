import connectDB from "./src/db/index.js";
import app from './src/app.js'
import path from 'path'
import fs from 'fs'

const publicfolder = path.join(process.cwd(), 'public')

if(!fs.existsSync(publicfolder)){
    fs.mkdirSync(publicfolder, {recursive: true})
}

await connectDB()
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







/*
 const app = express()
 ;(async () =>{
    try {
         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
         app.on("error", (error) =>{
             console.log("Error: ",error);
             throw error;
         })

         app.listen(process.env.PORT, () =>{
            console.log(`http://localhost:${process.env.PORT}`)
         })
    } catch (error) {
        console.log("Error: ",error);
    }
 })()
 */
