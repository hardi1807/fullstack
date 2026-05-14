import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {

        const dToken = req.headers.dtoken;

        console.log("DOCTOR TOKEN:", dToken);

        if (!dToken) {
            return res.json({
                success: false,
                message: 'Not Authorized'
            });
        }

        const decoded = jwt.verify(
            dToken,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

export default authDoctor;