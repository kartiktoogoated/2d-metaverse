import e, { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import client from "@repo/db/client"
import { AddElementSchema, CreateElementSchema, CreateSpacesSchema, DeleteElementSchema } from "../../types";
import { adminMiddleware } from "../../middleware/admin";
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

spaceRouter.delete("/:spaceId",async (req,res)=>{
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }
    })
    if(!space){
        res.status(400).json({message:"Space Not Found"});
        return;
    }

    if(!space.creatorId){
        res.status(400).json({message:"Space Not Found"});
        return;
    }
    if(space.creatorId !== req.userId){
        res.status(403).json({message:"Unauthorized"});
        return;
    }
    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.status(200).json({message:"Space Deleted"});

})

spaceRouter.get("/all",userMiddleware,async (req,res)=>{    
    const space = await client.space.findMany({
        where: {
            creatorId: req.userId!
        }
    })
    res.json({
        spaces: space.map(s=>({
            id: s.id,
            name: s.name,
            dimensions: `${s.width}x${s.height}`,
            thumbnail: s.thumbnail,
        }))
    })

})

spaceRouter.post("/element", userMiddleware,async (req,res)=>{
    const parsedData = AddElementSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        },select:{
            width:true,
            height:true
        }
    })
    if(!space){
        res.status(400).json({message:"Space Not Found"});
        return;
    }
    await client.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    }) 
    res.json({message:"Element Added"})
})

spaceRouter.delete("/element",userMiddleware,async (req,res)=>{
    const parsedData = DeleteElementSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "Validation Failed"});
        return;  
    }
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        },include:{
            space:true
        }
    })
    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(403).json({message:"Unauthorized"});
        return;
    }
    await client.spaceElements.delete({
        where: {
            id:parsedData.data.id
        }
    })
    
    res.json({message:"Element Deleted"})

})

spaceRouter.get("/:spaceId", userMiddleware,async (req,res)=>{
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },include:{
            elements:{
                include:{
                    element:true
                }
            }
        }
    })
    if(!space){
        res.status(400).json({message:"Space Not Found"});
        return;
    }
    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map(e=>({
            id: e.id,
            element: {
                id: e.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        }))
      
    })

})




