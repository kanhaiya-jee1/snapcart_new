import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

export  async function GET(req: NextRequest){
    try{
         await connectDb()
         const session= await auth()
         const userIdStr = session?.user?.id;
         if (!userIdStr) {
             return NextResponse.json([], {status:200})
         }
         
         const userIdObj = mongoose.Types.ObjectId.isValid(userIdStr)
             ? new mongoose.Types.ObjectId(userIdStr)
             : null;
             
         const userMatches = userIdObj ? [userIdStr, userIdObj] : [userIdStr];
         
         const assignments = await DeliveryAssignment.find({
            brodcastedTo: { $in: userMatches },
            status: "brodcasted"
         }).populate("order")
         
         return  NextResponse.json(
             assignments,{status:200}
         )

    }catch(error){
            return NextResponse.json(
                {message:`get assignments error${error}`}, {status:200}
            )
    }
}