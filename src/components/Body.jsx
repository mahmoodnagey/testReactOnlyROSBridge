// import { useState } from "react"
import CallService from "./CallService"
import Connection from "./Connection"
import RobotState from "./RobotState"
import Teleoperation from "./Teleoperation"

const Body = () => {
    // const [counter, setCounter] = useState(0);
    
  return (
    <div>
        <h1 className="text-center mt-4">Robot Control Page</h1>
        {/* <button onClick={() => setCounter(counter+1)}>count</button>
        <p>{counter}</p> */}
        
        <Connection />
        <Teleoperation />
        <RobotState />
        <CallService />
    </div>
  )
}

export default Body