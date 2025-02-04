import e, { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import client from "@repo/db/client"
import { CreateSpacesSchema } from "../../types";
export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware ,async (req,res)=>{
    const parsedData = CreateSpacesSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }

    if(!parsedData.data.mapId){
        const space = await client.space.create({
            data: { 
                name : parsedData.data.name,
                width : parseInt(parsedData.data.dimensions.split("x")[0]),
                height : parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        })
            res.json({spaceId:space.id});
        }
        const map = await client.map.findUnique({
            where: {
                id: parsedData.data.mapId
            }, select: {
                mapElements:true,
                width:true,
                height:true
            }
        })
        if(!map){
            res.status(400).json({message:"Map Not Found"});
            return;
        }   
       let space = await client.$transaction(async() => {
           const space = await client.space.create({
               data: { 
                   name : parsedData.data.name,
                   width : map.width,
                   height : map.height,
                   creatorId: req.userId!,
               }
           });

           await client.spaceElements.createMany({
               data: map.mapElements.map(e => ({
                   spaceId: space.id,
                   elementId: e.elementId,
                   x: e.x!,
                   y: e.y!
               })),
           });
           return space;
        })    
        res.json({spaceId:space.id});   
})

spaceRouter.delete("/:spaceId",(req,res)=>{


})

spaceRouter.get("/all",(req,res)=>{


})

spaceRouter.get("/:spaceId",(req,res)=>{


})

spaceRouter.post("/element",(req,res)=>{


})

spaceRouter.delete("/element",(req,res)=>{


})

