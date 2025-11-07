import { io } from "socket.io-client";

const socket = io("https://referral-creditsystem-production.up.railway.app", {
    transports: ["websocket"]
})

export default socket