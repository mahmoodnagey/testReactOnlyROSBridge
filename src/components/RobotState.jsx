import { useState } from "react"
import ROSLIB from "roslib"
import Config from "../scripts/config";
import { ros } from "./Connection";

const RobotState = () => {
    // const ros = new ROSLIB.Ros({ url: `ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}` });
    
    const [Xposition, setXPosition] = useState(0);
    const [Yposition, setYPosition] = useState(0);
    
    // const [msg, setMsg] = useState("msg");
    
    // let msg_subscriber = new ROSLIB.Topic({
    //    ros,
    //    name: Config.MY_TOPIC,
    //    messageType: "std_msgs/String"
    // });
    
    // msg_subscriber.subscribe((message) => {
    //     setMsg(message.data);
    // });
    
    // create a pose subscriber
    let pose_subscriber = new ROSLIB.Topic({
       ros: ros,
       name: Config.CMD_VEL_TOPIC,
       messageType: "geometry_msgs/Twist" 
    });
    
    // create a pose calllback
    pose_subscriber.subscribe((message) => {
        setXPosition(message.linear.x);
        setYPosition(message.linear.y);
    });
    
  return (
    <div className="m-5">
        <h3>Position</h3>
        <p className="m-2">x: {Xposition}</p>
        <p className="m-2">y: {Yposition}</p>
        {/* <p>Message: {msg}</p> */}
        
    </div>
  )
}

export default RobotState