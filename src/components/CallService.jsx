import ROSLIB from "roslib"
import { ros } from "./Connection";

const CallService = () => {
    const clearTurtleBG = () => {
            // Calling a service
       // -----------------
     
       var clearServiceClient = new ROSLIB.Service({
         ros : ros,
         name : '/clear',
         serviceType : 'std_srvs/Empty'
       });
     
       var request = new ROSLIB.ServiceRequest({

       });
     
       clearServiceClient.callService(request, function(result) {
         console.log('Result for service call on '
           + clearServiceClient.name
           + ': '
           + result);
       });
      };
      
      const turtleSpawn = () => {
        // Calling a service
        // -----------------
        
        var spawnServiceClient = new ROSLIB.Service({
            ros : ros,
            name : '/spawn',
            serviceType : 'turtlesim/srv/Spawn'
        });
        
        var request = new ROSLIB.ServiceRequest({
            x: 5,
            y: 5
        });
        
        spawnServiceClient.callService(request, function(result) {
            console.log('Result for service call on '
            + spawnServiceClient.name
            + result);
        });
        };
        
        const startRobosealer = () => {
            // Calling a service
       // -----------------
     
       var startServiceClient = new ROSLIB.Service({
         ros : ros,
         name : '/start',
         serviceType : 'std_srvs/Empty'
       });
     
       var request = new ROSLIB.ServiceRequest({

       });
     
       startServiceClient.callService(request, function(result) {
         console.log('Result for service call on '
           + startServiceClient.name
           + ': '
           + result);
       });
      };
  
  return (
    <>
        <button onClick={clearTurtleBG}>Clear Turtle BG</button>
        <button onClick={turtleSpawn}>Spawn Turtle</button>
        <button onClick={startRobosealer}>Start Robosealer</button>
        
    </>
  )
}

export default CallService