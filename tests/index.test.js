const axios2 = require('axios')

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
}

describe("Authentication", () => {
    test('User is able to sign up only once', async () => {
        const username = "kartik" + Math.random(); // kirat0.12331313
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(response.status).toBe(200)
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(updatedResponse.status).toBe(400);
    });

    test('Signup request fails if the username is empty', async () => {
        const username = `kartik-${Math.random()}`
        const password = "123abc"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password
        })

        expect(response.status).toBe(400)
    })

    test('Signin succeeds if the username and password are correct', async() => {
        const username = `kartik-${Math.random()}`
        const password = "123abc"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()
        
    })

    test('Signin fails if the username and password are incorrect', async() => {
        const username = `kartik-${Math.random()}`
        const password = "123abc"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })

        expect(response.status).toBe(403)
    })
})

// describe("User metadata endpoints",()=>{
//     let token ="";
//     let avatarId=""
//     beforeAll(async()=>{
//         const username = `kartik-${BACKEND_URL}` + Math.random();
//         const password = "123abc"

//         await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             type:"admin"
//         })
//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username,
//             password
//         })

//         token = response.data.token

//         const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//             "name": "timmy"
//         },{
//             headers:{
//                 "authorization":`Bearer ${token}`
//             }
//         })
//         avatarId= avatarResponse.data.avatarId;
//     })

//     test('User cant update metadata with wrong avatarid',async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
//             avatarId: "123123123"
//         },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         expect(response.statusCode).toBe(400)
//     })

//     test('User can update metadata with correct avatarid',async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
//             avatarId
//         },{
//             headers:{
//                 "authorization": `Bearer ${token}`
//             }
//         })
//         expect(response.statusCode).toBe(200)
//     })
    
//     test('User not able to update their metadata if the auth header is not present',async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
//             avatarId
//         })

//         expect(response.statusCode).toBe(403)
//     })
// });

// describe("User avatar information",()=>{
//     let avatarId;
//     let token;
//     let userId;
//     beforeAll(async()=>{
//         const username = `kartik-${BACKEND_URL}` + Math.random();
//         const password = "123abc"

//         const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             type:"admin"
//         })

//         userId= signupResponse.data.userId

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username,
//             password
//         })

//         token = response.data.token

//         const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//             "name": "timmy"
//         },{headers:{
//             "authorization":`Bearer ${token}`
//         }})
//         avatarId= avatarResponse.data.avatarId;
//     })

//     test('Get back information from the user', async()=>{
//         axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

//         expect(response.data.avatars.length).toBe(1);
//         expect(response.data.avatars[0].userId).toBe(userId);
//     })

//     test("Available avatars lists the recently created avatar", async () => {
//         const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
//         expect(response.data.avatars.length).not.toBe(0);
//         const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
//         expect(currentAvatar).toBeDefined()
//     })


// });

// describe("Space information",()=>{
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let adminToken;
//     let adminId;
//     let userToken;
//     let userId;

//     beforeAll(async()=>{
//         const username = `kartik-${BACKEND_URL}` + Math.random();
//         const password = "123abc"

//         const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             type:"admin"
//         })


//         adminId= signupResponse.data.adminId

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username,
//             password
//         })

//         adminToken = response.data.token

//         const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username: username + "-user",
//             password,
//             type:"user"
//         })


//         userId= userSignupResponse.data.userId

//         const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username + "-user",
//             password
//         })

//         userToken = userSigninResponse.data.token

//         const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })

//         const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })
//         element1Id=element1Response.id
//         element2id=element2Response.id

//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": [{
// 		         elementId: element1Id,
// 		        x: 20,
// 		        y: 20
// 	        }, {
// 	            elementId: element1Id,
// 		        x: 18,
// 		        y: 20
// 	        }, {
// 	            elementId: element2Id,
// 		        x: 19,
// 		        y: 20
// 	            }
//              ]
//         },{
//             headers: {
//                 authorization:`Bearer ${adminToken}`
//             }
//         })

//         mapId = mapResponse.data.id
//     });

//     test('User is able to create a space', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "test",
//             "dimensions": "100x200",
//             "mapId":mapId
//         }, {headers:{
//             authorization: `Bearer ${userToken}`
//         }})

//         expect(response.data.spaceId).toBeDefined()
//     })

//     test('User is able to create a space without map id(empty space)', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "test",
//             "dimensions":"100x200"
//         },{headers:{
//             authorization: `Bearer ${userToken}`
//         }})

//         expect(response.data.spaceId).toBeDefined()
//     })

//     test('User is not able to create a space without map id or dimensions', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "test",
//         },{headers:{
//             authorization: `Bearer ${userToken}`
//         }})

//         expect(response.statusCode).toBe(400)
//     })

//     test('User is not able to delete a space that doesnt exist', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,{
//             headers:{
//             authorization: `Bearer ${userToken}`
//         }
//     })

//         expect(response.statusCode).toBe(400)
//     })

//     test('User is able to delete a space that doesnt exist', async ()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "test",
//             "dimensions": "100x200"
//         },{headers:{
//             authorization: `Bearer ${userToken}`
//         }})

//         const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{headers:{
//             authorization: `Bearer ${userToken}`
//         }
//     })

//         expect(deleteResponse.statusCode).toBe(200)
//     })

//     test('User should not be able to delete any others space', async()=>{
//         const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "test",
//             "dimensions": "100x200"
//         },{headers:{
//             authorization: `Bearer ${userToken}`
//         }})

//         const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{headers:{
//             authorization: `Bearer ${adminToken}`
//         }
//     })

//         expect(deleteResponse.statusCode).toBe(400)
    
//     })
    
//     test('Admin has no spaces initially', async()=>{
//         const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,
//             {
//                 headers: {
//                 authorization: `Bearer ${userToken}`
//         }
//     });
//         expect(response.data.spaces.length).toBe(0)
//     })

//     test('Admin creates space', async()=>{
//             const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`,{
//                 "name": "test",
//                 "dimensions": "100x200"
//             },{
//                 headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         });
//             const response = axios.get(`${BACKEND_URL}/api/v1/space/all`,{
//                 headers: {
//                 authorization: `Bearer ${userToken}`
//             }
//         });
//             const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
//             expect(response.data.spaces.length).toBe(1)
//             expect(filteredSpace).toBeDefined()
//         });
// });

// describe('Arena endpoints', ()=>{
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let adminToken;
//     let adminId;
//     let userToken;
//     let userId;
//     let spaceId;

//     beforeAll(async()=>{
//         const username = `kartik-${BACKEND_URL}` + Math.random();
//         const password = "123abc"

//         const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             type:"admin"
//         })


//         adminId= signupResponse.data.adminId

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username ,
//             password
//         })

//         adminToken = response.data.token

//         const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username: username + "-user",
//             password,
//             type:"user"
//         })


//         userId= userSignupResponse.data.userId

//         const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username + "-user",
//             password
//         })

//         userToken = userSigninResponse.data.token

//         const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })

//         const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })
//         element1Id=element1Response.data.id
//         element2id=element2Response.data.id

//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": [{
// 		         elementId: element1Id,
// 		        x: 20,
// 		        y: 20
// 	        }, {
// 	            elementId: element1Id,
// 		        x: 18,
// 		        y: 20
// 	        }, {
// 	            elementId: element2Id,
// 		        x: 19,
// 		        y: 20
// 	            }
//              ]
//         },{
//             headers: {
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })
//         mapId = mapResponse.data.id

//         const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/`,{
//             "name":"test",
//             "dimensions": "100x200",
//             "mapId":mapId
//         },{
//             headers:{
//                 'authorization':`Bearer ${userToken}`
//             }})

//             spaceId = spaceResponse.spaceId

//     });

//     test('Incorrect spaceId returns a 400', async()=>{
//         const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`,{
//             headers:{
//                 "authorization":`Bearer ${userToken}`
//             }
//         })
//             expect(response.statusCode).toBe(400)
        
//     })
    
//     test('Correct spaceId returns all elements', async()=>{
//         const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
//                 headers:{
//                     "authorization":`Bearer ${userToken}`
//                 }
//         });
//             expect(response.data.dimensions).toBe("100x200")
//             expect(response.data.elements).toBe(3)
//         })

//     test('Delete endpoint deletes an element', async()=>{

//         const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
//                 headers:{
//                     "authorization":`Bearer ${userToken}`
//                 }
//         });

//         await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
//             spaceId: spaceId,
//             elementId: response.data.elements[0].id
//         },{
//                 headers:{
//                     "authorization":`Bearer ${userToken}`
//                 }
//         });

//         const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
//             headers:{
//                 "authorization":`Bearer ${userToken}`
//             }
//         });

//             expect(newResponse.data.elements).toBe(2)
//         })

//     test('Adding an element fails if the dimensions lies outside the dimensions', async()=>{

//         await axios.post(`${BACKEND_URL}/api/v1/space/element`,{
//             "elementId": element1Id,
//             "spaceId":spaceId,
//             "x": 1000,
//             "y": 210000
//         },{
//             headers:{
//                 "authorization":`Bearer ${userToken}`
//             }
//         });

//             expect(newResponse.statusCode).toBe(400)
//         })

//     test('Adding an element works as expected', async()=>{

//         await axios.post(`${BACKEND_URL}/api/v1/space/element`,{
//             "elementId": element1Id,
//             "spaceId":spaceId,
//             "x": 50,
//             "y": 20
//         },{headers:{
//             "authorization":`Bearer ${userToken}`
//         }});
//         })

// });

// describe('Admin Endpoints',()=>{
//     let adminToken;
//     let adminId;
//     let userToken;
//     let userId;

//     beforeAll(async()=>{
//         const username = `kartik-${BACKEND_URL}` + Math.random();
//         const password = "123abc"

//         const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             type:"admin"
//         })


//         adminId= signupResponse.data.adminId

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username ,
//             password
//         })

//         adminToken = response.data.token

//         const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username: username + "-user",
//             password,
//             type:"user"
//         })


//         userId= userSignupResponse.data.userId

//         const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username + "-user",
//             password
//         })

//         userToken = userSigninResponse.data.token
//     });

//     test('User is not able to hit admin Endpoints', async()=>{
//         const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${userToken}`
//             }
//         });

        
//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": []
//         },{
//             headers: {
//                 authorization:`Bearer ${userToken}`
//                 }
//             })
//             const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "100 person interview room",
//                 "defaultElements": []
//             },{
//                 headers: {
//                     authorization:`Bearer ${userToken}`
//                     }
//                 })

//             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
//                 "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//                 "name": "timmy"
//         },{
//             headers:{
//                 "authorization":`Bearer ${userToken}`
//             }
//         })

//         const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//             "name": "timmy"
//         },{
//             headers:{
//                 "authorization":`Bearer ${userToken}`
//             }
//         })
//             expect(elementResponse.statusCode).toBe(403)
//             expect(mapResponse.statusCode).toBe(403)
//             expect(avatarResponse.statusCode).toBe(403)
//             expect(updateElementResponse.statusCode).toBe(403)
            
//         })

//     test('Admin is able to hit admin Endpoints', async()=>{
//         const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         });

        
//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": []
//         },{
//             headers: {
//                 authorization:`Bearer ${adminToken}`
//                 }
//             })
//             const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "100 person interview room",
//                 "defaultElements": []
//             },{
//                 headers: {
//                     authorization:`Bearer ${adminToken}`
//                     }
//                 })

//             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
//                 "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//                 "name": "timmy"
//         },{
//             headers:{
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })

//             expect(elementResponse.statusCode).toBe(200)
//             expect(mapResponse.statusCode).toBe(200)
//             expect(avatarResponse.statusCode).toBe(200)            
//         })
        
//     test('Admin is able to update the imageUrl for an element', async()=>{
        
//         const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         });

//         const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//             "name": "timmy"
//         },{
//             headers:{
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })
//         expect(updateElementResponse.statusCode).toBe(200)
//     })
// });

// describe('Websocket tests', ()=>{
//     let adminToken;
//     let adminUserId;
//     let userToken;
//     let userId;
//     let mapId;
//     let element1Id;
//     let element2Id;
//     let spaceId;
//     let ws1;
//     let ws2;
//     let ws1Messages = [];
//     let ws2Messages = [];
//     let userX;
//     let userY;
//     let adminX;
//     let adminY;

//     async function waitForAndPopLatestMessage(messageArray) {
//         return new Promise(r => {
//             if(messageArray.length > 0){
//                 resolve(messageArray.shift())
//             }else {
//                 let interval = setInterval(()=>{
//                     if(messageArray.length > 0){
//                         resolve(messageArray.shift())
//                         clearInterval(interval)
//                     }
//             },100)
//             }
//         })
//     }

//     async function setupHTTP(){
//         const username = `kartik-${Math.random()}`
//         const password = "123abc"
//         const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username,
//             password,
//             role: "admin"
//         })

//         const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username,
//             password
//         })

//         adminUserId = adminSignupResponse.data.userId;
//         adminToken = adminSigninResponse.data.token;

//         const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username: username + `-user`,
//             password
//         })

//         const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username: username + `-user`,
//             password
//         })

//         userId= userSignupResponse.data.userId;
//         userToken = userSigninResponse.data.token;

//         const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })

//         const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": "1",
//             "height": "1",
//             "static": true
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })
//         element1Id=element1Response.data.id
//         element2id=element2Response.data.id

//         const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": [{
// 		         elementId: element1Id,
// 		        x: 20,
// 		        y: 20
// 	        }, {
// 	            elementId: element1Id,
// 		        x: 18,
// 		        y: 20
// 	        }, {
// 	            elementId: element2Id,
// 		        x: 19,
// 		        y: 20
// 	            }
//              ]
//         },{
//             headers: {
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })
//         mapId = mapResponse.data.id

//         const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/`,{
//             "name":"test",
//             "dimensions": "100x200",
//             "mapId":mapId
//         },{
//             headers:{
//                 'authorization':`Bearer ${userToken}`
//             }})

//             spaceId = spaceResponse.spaceId

//     }

//     async function setupWs(){
//         ws1 = new WebSocket(WS_URL)

//         await new Promise(r =>{
//             ws1.onopen = r
//         })

//         ws1.onmessage = (event) =>{
//             ws1Messages.push(JSON.parse(event.data))
//         }

//         ws2 = new WebSocket(WS_URL)

//         await new Promise(r =>{
//             ws2.onopen = r
//         })

//         ws2.onmessage = (event) =>{
//             ws2Messages.push(JSON.parse(event.data))
//         }

        
//     }

//     beforeAll(async() => {
//         setupHTTP()
//         setupWs()
//     });

//     test('Get back ack for joining the space', async()=>{
//         ws1.send(JSON.stringify({
//                 "type": "join",
//                 "payload": {
//                     "spaceId": spaceId,
//                     "token": adminToken
//             }
//         }))
//         const message1 = await waitForAndPopLatestMessage(ws1Messages);

//         ws2.send(JSON.stringify({
//             "type": "join",
//             "payload": {
//                 "spaceId": spaceId,
//                 "token": userToken
//             }
//         }))

//         const message2 = await waitForAndPopLatestMessage(ws2Messages);
//         const message3 = await waitForAndPopLatestMessage(ws3Messages);

//         expect(message1.type).toBe("space-joined")
//         expect(message2.type).toBe("server-joined") 
//         expect(message1.payload.users.length).toBe(0)
//         expect(message2.payload.users.length).toBe(1)
//         expect(message3.type).toBe("user-join")
//         expect(message3.payload.x).toBe(message2.payload.spawn.x)
//         expect(message3.payload.y).toBe(message2.payload.spawn.y)
//         expect(message3.payload.userId).toBe(userId)


//         adminX = message1.payload.spawn.x
//         adminY = message2.payload.spawn.y

//         userX = message1.payload.spawn.x
//         userY = message2.payload.spawn.y

//     })

//     test('User should not be able to move two blocks at the same time', async()=>{
//         ws1.send(JSON.stringify({
//             type: "movement",
//             payload:{
//                 x:100000,
//                 y:1000
//             }
//         }));

//         const message = await waitForAndPopLatestMessage(ws1Messages);
//         expect(message.type).toBe("movement-rejected")
//         expect(message.payload.x).toBe(adminX)
//         expect(message.payload.y).toBe(adminY) 
        
//     })

//     test('User should not be able to move across the boundary of the wall', async()=>{
//         ws1.send(JSON.stringify({
//             type: "movement",
//             payload:{
//                 x:adminX + 2,
//                 y:adminY + 2
//             }
//         }));

//         const message = await waitForAndPopLatestMessage(ws1Messages);
//         expect(message.type).toBe("movement-rejected")
//         expect(message.payload.x).toBe(adminX)
//         expect(message.payload.y).toBe(adminY) 
        
//     })

//     test('Correct movement should be broadcasted to other sockets in the room', async()=>{
//         ws1.send(JSON.stringify({
//             type: "movement",
//             payload:{
//                 x:adminX + 1,
//                 y:adminY ,
//                 userId: adminId
//             }
//         }));

//         const message = await waitForAndPopLatestMessage(ws2Messages);
//         expect(message.type).toBe("movement-rejected")
//         expect(message.payload.x).toBe(adminX + 1)
//         expect(message.payload.y).toBe(adminY) 
        
//     })

//     test('If a user leaves the other user recieves a leave event', async()=>{
//         ws1.close()
//         const message = await waitForAndPopLatestMessage(ws1Messages);
//         expect(message.type).toBe("user-left")
//         expect(message.payload.userId).toBe(adminUserId)
        
//     })
// })


