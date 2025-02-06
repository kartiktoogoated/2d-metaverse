import { Router } from "express";
import client from "@repo/db/client";   
import { adminMiddleware } from "../../middleware/admin";
import {  createAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";

export const adminRouter = Router();

adminRouter.post("/element",adminMiddleware, async (req,res)=>{
    const parsedData = CreateElementSchema.safeParse(req.body);    
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    const element = await client.element.create({
        data: {
            imageUrl: parsedData.data.imageUrl,
            width: parsedData.data.width,
            height: parsedData.data.height, 
            static: parsedData.data.static,
        }
            
    })
    res.json({id:element.id})
})

adminRouter.put("/element/:elementId",(req,res)=>{
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if(!parsedData.success){        
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({message:"Element Updated"})
})

adminRouter.post("/avatar",async (req,res)=>{
    const parsedData = createAvatarSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({id:avatar.id})
})

adminRouter.post("/map",async(req,res)=>{
    const parsedData = CreateMapSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]),
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            thumbnail: parsedData.data.thumbnail,
            mapElements: {
                create: parsedData.data.defaultElements.map(e=>({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })
    res.json({id:map.id})
})

// adminRouter.get("/:spaceId",(req,res)=>{
    
// })