let allowedMethods = ["GET", "PUT", "PATCH", "POST", "DELETE"];

const cors = async (req, res, next) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Vary", "Origin");

        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", allowedMethods.join());
            return res.status(200).json({});
        }

        if (req.url.includes("api") && req.headers["x-app-token"] === "Robosealers-Team") return next()
        
        return res.status(500).json({ success: false, error: "Unexpected Error Happened.", code: 500 });

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({ success: false, error: "Unexpected Error Happened.", code: 500 });
    }

}

module.exports = cors;
