import { getAuth } from "@clerk/express";

export const getUserDetail = (req,res)=>{
    const {userId} = getAuth(req)
    res.json({userId,message:"secure data"})
}