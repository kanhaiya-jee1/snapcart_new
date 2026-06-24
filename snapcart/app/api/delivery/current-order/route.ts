import connectDb from "@/app/lib/db";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest){
    try{
      await connectDb()
      const session= await auth()
      const deliveryBoyId =  session?.user?.id
      if (!deliveryBoyId) {
          return NextResponse.json({active:false}, {status:200})
      }
      
      const deliveryBoyIdObj = mongoose.Types.ObjectId.isValid(deliveryBoyId)
          ? new mongoose.Types.ObjectId(deliveryBoyId)
          : null;
          
      const activeAssignment= await DeliveryAssignment.findOne({
        assignedTo: { $in: [deliveryBoyId, deliveryBoyIdObj].filter(Boolean) },
        status:"assigned"
      }).populate("order").lean()

      if(!activeAssignment){
          return NextResponse.json(
            {active:false},
            {status:200}
          )
      }

            return NextResponse.json(
            {active:true,assignment:activeAssignment},
            {status:200}
          )

    }catch(error){
            return NextResponse.json(
            {message:`current order error${error}`},
            {status:200}
          )
    }
}