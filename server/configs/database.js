const mongoose = require("mongoose")

// const uriMap = {
//     local: process.env.LOCAL_DB_URI,
//     development: process.env.DEV_DB_URL
// };
// const selectedEnv = process.env.CURRENT_URL || 'development';
// let uri = uriMap[selectedEnv];

const connection = async () => {
    return mongoose.connect("mongodb+srv://robosealerdev:3P6zyaEuiRhCnT6m@robosealerdev.eb1vyhp.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            // console.log(`Connected to MongoDB database successfully on ${selectedEnv} environment!`);
            console.log(`Connected to MongoDB database successfully on dev environment!`);

        }).catch((err) => {
            console.log("MongoDB Error: ", err);
        })
}


module.exports = connection

