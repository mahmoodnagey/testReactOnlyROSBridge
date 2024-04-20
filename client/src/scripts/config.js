const Config = {
    // ROSBRIDGE_SERVER_IP: "fc94:b376:aa06:24af:52b8:62c2:d295:1be1", // VPN test ip address
    // ROSBRIDGE_SERVER_IP: "localhost",
    ROSBRIDGE_SERVER_IP: "abdxi",
    // ROSBRIDGE_SERVER_IP: "192.168.1.102", // Abdelrahman device ip address
    ROSBRIDGE_SERVER_PORT: "9090",
    RECONNECTION_TIMER: 3000,
    CMD_VEL_TOPIC: "/turtle1/cmd_vel",
    POSE_TOPIC: "/turtle1/pose",
    MY_TOPIC: "/my_topic"
  };
  
  export default Config;