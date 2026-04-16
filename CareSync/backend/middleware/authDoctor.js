import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const token = req.headers.token; 

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 

        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default authDoctor;




/*import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    const { dtoken } = req.headers
    if (!dtoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor; */