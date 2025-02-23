import { WebSocketServer } from "ws";
import { User } from "./User";
import { WebRTCManager } from "./WebRTCManager";
import * as url from "url"; // ✅ Import URL module to extract query params

const wss = new WebSocketServer({ port: 3001 });
const rtcManager = new WebRTCManager();

wss.on("connection", function connection(ws, req) {
    console.log("✅ User connected");

    // ✅ Extract token and spaceId from WebSocket query parameters
    const params = new URLSearchParams(url.parse(req.url!).query || "");
    const token = params.get("token");
    const spaceId = params.get("spaceId");

    if (!token || !spaceId) {
        console.error("❌ Missing token or spaceId, closing connection.");
        ws.close();
        return;
    }

    let user = new User(ws);

    // ✅ Register user in WebRTCManager for signaling
    rtcManager.registerUser(user.id, ws, spaceId);

    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());

        switch (data.type) {
            case "webrtc-offer":
            case "webrtc-answer":
            case "webrtc-ice-candidate":
                rtcManager.handleMessage(data);
                break;
        }
    });

    ws.on("error", (error) => {
        console.error("❌ WebSocket error:", error);
    });

    ws.on("close", () => {
        user?.destroy();
        rtcManager.removeUser(user.id);
        console.log(`❌ User ${user.id} disconnected`);
    });
});

console.log("🚀 WebSocket Server running on ws://localhost:3001");
