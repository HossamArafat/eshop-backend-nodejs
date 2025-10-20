import { validationResult } from "express-validator";

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req)
    // If there are multiple errors or without code, default code => 400
    const errorsArr = errors.errors.map((item)=> ({...item, msg: item.msg.message? item.msg.message : item.msg}))
    
    // If there are only one error,  code => accordding to the status of error
    const caughtError = errors.errors[0]
    const code = caughtError?.msg?.statusCode

    if(!errors.isEmpty()) {
        return res.status(errorsArr.length > 1 || !code ? 400 : code ).json(errorsArr) 
    }
    next()
}

export default validatorMiddleware