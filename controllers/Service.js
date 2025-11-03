const jwt = require('jsonwebtoken')

module.exports = {
    getToken: (req) => {
        return req.headers.authorization.replace('Bearer ', '');
    },
    isLogin: (req, res, next) => {

        // console.log('auth' + req.headers.authorization)

        if (!req.headers.authorization) {
            return res.status(401).send({ statu: false, error: 'Token is Empty' })
        }

        const token = req.headers.authorization.replace('Bearer ', '');
        const key = process.env.SECRET_KEY;

        // console.log('token ' + token)

        try {
            const verify = jwt.verify(token, key)
            if (verify) {
                next()
            }

        } catch (error) {
            return res.status(500).send({ statu: false, error: error.message })
        }

        // return res.status(401).send({ status: false, error: 'Unauthorized' })
    },
    async getMemberId(req) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const payload = jwt.decode(token.trim())
        return payload.id;
    },
    async getAdminId(req) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const payload = jwt.decode(token.trim())
        return payload.id;
    }
}
