module.exports = (schema) => {
    return (req, res, next) => {
        try {
            let validationResult = schema.body.validate(req.body);
            var validation = [];
            if (validationResult.error) {
                validation.push(validationResult.error.details[0].message)
            }
            if (validation.length) {
                return res.status(400).json({ success: false, error: validation.join(), code: 400 });
            }
            return next();
        }
        catch (err) {
            console.log(`err.message`, err);
            return res.status(400).json({ success: false, error: "Bad Request.", code: 400 });
        }
    }
}