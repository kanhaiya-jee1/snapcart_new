import DeliveryBoy from "@/app/components/DeliveryBoy";
import connectDb from "@/app/lib/db";
import emitEventHandler from "@/app/lib/emitEventHandler";
import DeliveryAssignment from "@/app/models/deliveryAssignment.model";
import Order from "@/app/models/order.model";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async  function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
     try{
        await connectDb()
        const {id}= await params
        const session= await auth()
        const deliveryBoyId= session?.user?.id
        if(!deliveryBoyId){
            return NextResponse.json({message:"unauthorize"},{status:400})
        }

        const assignment= await DeliveryAssignment.findById(id)
        if(!assignment){
             return NextResponse.json({message:"assignments not found"},{status:400})
        }
        if(assignment.status!=="brodcasted"){
             return NextResponse.json({message:"assignments not found"},{status:400})
        }

        const alreadyAssigned= await DeliveryAssignment.findOne({
            assignedTo:deliveryBoyId,
            status:{$nin:["brodcasted", "completed"]}
        })

        if(alreadyAssigned){
             return NextResponse.json({message:"already assigned to other order"},{status:400})
        }
        
        assignment.assignedTo=deliveryBoyId
        assignment.status="assigned"
        assignment.acceptedAt=new Date()
        await assignment.save()

         const order= await Order.findById(assignment.order)
         if(!order){
             return NextResponse.json({message:"order not found"},{status:400})
         }
         
         order.assignedDeliveryBoy=deliveryBoyId
         await order.save()

         await  order.populate("assignedDeliveryBoy")

         await emitEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})

         await DeliveryAssignment.updateMany(
            {_id:{$ne:assignment._id},
            brodcastedTo:deliveryBoyId,
            status:"brodcasted"
         },
         {
            $pull:{brodcastedTo:deliveryBoyId}
         }
         )



         return NextResponse.json({message:"order accepted successfully"},{status:200})

     }catch(error){
      return NextResponse.json({message:`accept assignment error${error}`},{status:500})
     }
}