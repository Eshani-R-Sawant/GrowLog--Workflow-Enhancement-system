import {connect} from "mongoose";
const dbConnect = async() =>{
    try{
        const mongoDbConnection = await connect (process.env.MONGO_CONNECTION_STRING)
        console.log("DB connected")
    }catch (error){
        console.log(`Database connection failed ${error}`);
        process.exit(1);
    }


};

export default dbConnect;