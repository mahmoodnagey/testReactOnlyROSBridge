import { useState } from "react";
import ROSLIB from "roslib"
import Config from "../scripts/config";

// eslint-disable-next-line react-refresh/only-export-components
export const ros = new ROSLIB.Ros({ url: `ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}` });

const Connection = () => {
    
    const [isConnected, setIsConnected] = useState(false);
    ros.on("connection", () => setIsConnected(true));
    ros.on("error", () => {
        setIsConnected(false);
        console.log("Connection error");
    });
    
    ros.on("close", () => {
        console.log("Connection closed");
        setIsConnected(false);
        // setTimeout(() => {
        //     try {
        //         ros.connect("ws://localhost:9090");
        //     } catch (error) {
        //         console.log("Connection error");
        //     }
        // }, Config.RECONNECTION_TIMER);
    });
    
  return (
    <div className = "text-center m-4">
        
        <p>{isConnected? " Robot Connected": " !! Robot Disconnected!! "}</p>
        
        
        

    </div>
  )
}

export default Connection