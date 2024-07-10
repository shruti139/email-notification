const Joi = require("joi");

const validateUser = async (req, res, next) => {
    const Schema = Joi.object({
        password: Joi.string().min(4).max(8).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    })

    const { error } = Schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(203).send({
            error: errorMessages.join(', '),
            message: errorMessages.join(', '),
            isSuccess: false
        });
    }
    next();
}


module.exports = { validateUser }