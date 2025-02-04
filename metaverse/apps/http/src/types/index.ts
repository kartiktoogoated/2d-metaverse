import z from "zod"

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["admin","user"]),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({ 
    avatarId: z.string()
})

export const CreateSpacesSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string()
})

export const AddElementSchema = z.object({
    name: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(), 
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const createAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements:z.array(z.object({
        elementId: z.string(),
        x: z.number(),  
        y: z.number(),
    }))

})
