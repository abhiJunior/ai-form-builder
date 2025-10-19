import 'dotenv/config'
import mongoose from "mongoose";

const connectToDB = async()=>{
    try{
        const {connection} = await mongoose.connect(
            `mongodb+srv://userdb:${process.env.DATABASE_PASSWORD}@cluster0.hkbuoog.mongodb.net/AI-form-builder?retryWrites=true&w=majority&appName=Cluster0`
        )
        if (connection){
            console.log(`connected to DB Sucessfully at ${connection.host}`)
        }
    }catch(e){
        console.log("Failed to connect to DB",e.message)
    }
    
}

export default connectToDB