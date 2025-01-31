const axios = require('axios')

const BACKEND_URL ="http://localhost:3000"

describe("Authentication",()=>{
    test('User to be able to sign up only once',async ()=>{
        const username = "kartik" + Math.random();
        const password = "123abc";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(response.statusCode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(updatedResponse.statusCode).toBe(400)
    })
    
    test('Signup request fails if username is empty', async ()=>{
        const username = `kartik-${Math.random()}`
        const password = "123abc"
        const response= await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        })

        expect(response.statusCode).toBe(400)
    })

    test('Signin succeeds if the username and password are correct', async ()=>{
        const username = `kartik-${BACKEND_URL}` + Math.random();
        const password = "123abc"

         await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
    });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
    });

    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBeDefined()
    
    })

    test('Signin fails if the username and password are wrong', async ()=>{
        const username = `kartik-${BACKEND_URL}`+Math.random();
        const password = "123abc"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "wrong",
            password
        })

        expect(response.statusCode).toBe(403)

    })

    
});

describe("User metadata endpoints",()=>{
    let token ="";
    let avatarId=""
    beforeAll(async()=>{
        const username = `kartik-${BACKEND_URL}` + Math.random();
        const password = "123abc"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "timmy"
        },{
            headers:{
                authorization:`Bearer ${token}`
            }
        })
        avatarId= avatarResponse.data.avatarId;
    })

    test('User cant update metadata with wrong avatarid',async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: "123123123"
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        expect(response.statusCode).toBe(400)
    })

    test('User can update metadata with correct avatarid',async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        expect(response.statusCode).toBe(200)
    })
    
    test('User not able to update their metadata if the auth header is not present',async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        })

        expect(response.statusCode).toBe(403)
    })
});

describe("User avatar information",()=>{
    let avatarId;
    let token;
    let userId;
    beforeAll(async()=>{
        const username = `kartik-${BACKEND_URL}` + Math.random();
        const password = "123abc"

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })

        userId= signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "timmy"
        })
        avatarId= avatarResponse.data.avatarId;
    })

    test('Get back information from the user', async()=>{
        axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
    })

    test("Available avatars lists the recently created avatar", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined()
    })


})

describe("Space information",()=>{
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;

    beforeAll(async()=>{
        const username = `kartik-${BACKEND_URL}` + Math.random();
        const password = "123abc"

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })


        adminId= signupResponse.data.adminId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminToken = response.data.token

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })


        userId= userSignupResponse.data.userId

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        userToken = userSigninResponse.data.token

        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": "1",
            "height": "1",
            "static": true
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": "1",
            "height": "1",
            "static": true
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })
        element1Id=element1.id
        element2id=element2.id

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
		         elementId: element1Id,
		        x: 20,
		        y: 20
	        }, {
	            elementId: element1Id,
		        x: 18,
		        y: 20
	        }, {
	            elementId: element2Id,
		        x: 19,
		        y: 20
	            }
             ]
        },{
            headers: {
                authorization:`Bearer ${adminToken}`
            }
        })

        mapId = map.id
    });

    test('User is able to create a space', async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200",
            "mapId":mapId
        }, {headers:{
            authorization: `Bearer ${userToken}`
        }})

        expect(response.spaceId).toBeDefined()
    })

    test('User is able to create a space without map id(empty space)', async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions":"100x200"
        },{headers:{
            authorization: `Bearer ${userToken}`
        }})

        expect(response.spaceId).toBeDefined()
    })

    test('User is not able to create a space without map id or dimensions', async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
        },{headers:{
            authorization: `Bearer ${userToken}`
        }})

        expect(response.statusCode).toBe(400)
    })

    test('User is not able to delete a space that doesnt exist', async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,{
            headers:{
            authorization: `Bearer ${userToken}`
        }
    })

        expect(response.statusCode).toBe(400)
    })

    test('User is able to delete a space that doesnt exist', async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200"
        },{headers:{
            authorization: `Bearer ${userToken}`
        }})

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{headers:{
            authorization: `Bearer ${userToken}`
        }
    })

        expect(deleteResponse.statusCode).toBe(200)
    })

    test('User should not be able to delete any others space', async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200"
        },{headers:{
            authorization: `Bearer ${userToken}`
        }})

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{headers:{
            authorization: `Bearer ${adminToken}`
        }
    })

        expect(deleteResponse.statusCode).toBe(400)
    
    })
    
    test('Admin has no spaces initially', async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,
            {
                headers: {
                authorization: `Bearer ${userToken}`
        }
    });
        expect(response.data.spaces.length).toBe(0)
    })

    test('Admin creates space', async()=>{
            const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`,{
                "name": "test",
                "dimensions": "100x200"
            },{
                headers: {
                authorization: `Bearer ${userToken}`
            }
        });
            const response = axios.get(`${BACKEND_URL}/api/v1/space/all`,{
                headers: {
                authorization: `Bearer ${userToken}`
            }
        });
            const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
            expect(response.data.spaces.length).toBe(1)
            expect(filteredSpace).toBeDefined()
        });
        
    })

