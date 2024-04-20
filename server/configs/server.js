const app = require("./app");
const http = require('http');
const server = http.createServer(app);


// server.listen(process.env.PORT || 4000, () => {
//     console.log(`Server is up and runing on port ${process.env.PORT}!`)
// })

server.listen(4000, () => {
    console.log(`Server is up and runing on port 4000`)
})


module.exports = app