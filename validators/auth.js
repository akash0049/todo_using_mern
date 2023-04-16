const jwt = require("jsonwebtoken");
const client = require("../redis_service/redis_config");

const generateToken = async (user) => {
    const JWT_SECRET_KEY = await client.get('jwt_secret_key');
    const signedToken = jwt.sign(
        {
            userName: user.userName,
        },
        JWT_SECRET_KEY,
        { expiresIn: "24h" }
    );
    return signedToken;
};

const isAuthorized = async (req, res, next) => {
    const JWT_SECRET_KEY = await client.get('jwt_secret_key');
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, JWT_SECRET_KEY, async (error, decode) => {
            if (error) {
                return res
                    .status(401)
                    .send({ message: "Not Authorized", error: error.message });
            }
            const isSessionActive = await client.get(decode.userName);
            if (!isSessionActive) {
                return res
                    .status(403)
                    .send({ message: "Session closed!! Please login again" });
            }
            req.user = decode;
            next();
            return;
        });
    } else {
        return res.status(400).send({ message: "Not Authorized" });
    }
};

module.exports = { generateToken, isAuthorized }