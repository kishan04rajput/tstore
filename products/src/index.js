import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";
import grpcSever from "./gRPC/server.js";

dotenv.config({
    path: './.env'
})
const port = process.env.ORDERS_PORT || 8002;

connectDB()
.then(()=>{
    app.listen(port, () => {
        app.on("error", (error)=>{
            console.log("ERR: ", error);
        })
        console.log(`Server Running on Port ${port}`);
    })
    grpcSever();
})
.catch((error)=>{
    console.log("Unable to Connect with Mongo Database!", error);
});