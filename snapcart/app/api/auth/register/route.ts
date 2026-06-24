import connectDb  from "@/app/lib/db";
import { NextRequest,NextResponse } from "next/server";
import User from "@/app/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest){
     try{
        await connectDb()
       const {name, email,password} = await req.json()
       const existUser=await User.findOne({email})
       if(existUser){
         return NextResponse.json(
            {
              message:"email already exists"
            },
            {status:400}
         )
       }
      if(password.length<6){
          return NextResponse.json(
                {
              message:"password must be at least 6 characters"
            },
            {status:400}
          )
            
      }

      const hashedPassword= await  bcrypt.hash(password,10)
      await User.create({
         name,email,password:hashedPassword
      })

           return NextResponse.json(
                {
              message:"User registered successfully"
            },
            {status:201}
          )

         
     }catch(error){
            console.error("Registration error:", error)
            return NextResponse.json(
                {
              message:`registration failed: ${error instanceof Error ? error.message : String(error)}`
            },
            {status:500}
          )
     }
}