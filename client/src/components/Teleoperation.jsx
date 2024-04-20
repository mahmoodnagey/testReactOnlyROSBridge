import { Joystick } from 'react-joystick-component';
import ROSLIB from "roslib"
import Config from "../scripts/config";
import { ros } from './Connection';

const Teleoperation = () => {
    // const ros = new ROSLIB.Ros({ url: `ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}` });
    const handleMove = (event) => {
        // WE need to create a ROS publisher on the topic cmd_vel
        let cmd_vel = new ROSLIB.Topic({
            ros: ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: "geometry_msgs/Twist"
        });
        
        // We need to create a twist message to be published to rosbridge
        let twist = new ROSLIB.Message({
            linear: {
                x: event.x*3,
                y: event.y*3,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: 0,
            }
        });
        
        // We need to publish the message on the cmd_vel topic
        cmd_vel.publish(twist);
    };
    const handleStop = () => {
        console.log("Stopping");
        // WE need to create a ROS publisher on the topic cmd_vel
        let cmd_vel = new ROSLIB.Topic({
            ros: ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: "geometry_msgs/Twist"
        });
        
        // We need to create a twist message to be published to rosbridge
        let twist = new ROSLIB.Message({
            linear: {
                x: 0,
                y: 0,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: 0,
            }
        });
        
        // We need to publish the message on the cmd_vel topic
        cmd_vel.publish(twist);};
  return (
    <div className = "m-5">
        <Joystick size={100} sticky={true} baseColor="#EEEEEE" stickColor="#BBBBBB" move={handleMove} stop={handleStop}></Joystick>

    </div>
  )
}

export default Teleoperation