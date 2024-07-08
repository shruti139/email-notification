const Joi = require("joi");

 const  validateCronJob = async (req, res, next) => {
const Schema = Joi.object({
    apiURL: Joi.string().required(),
    method: Joi.string().required(),
    body: Joi.string().optional(),
    header: Joi.string().optional(),
    statusCode: Joi.array().required(),
    time: Joi.string().required(),
    email: Joi.string().required(),

})

    const { error } = Schema.validate(req.body);
    if (error) {
        return res.status(203).send({
            error: error.details[0].message,
            message: "Something went wrong, please try again!",
            isSuccess: false});
    }
    next();
}


module.exports = {validateCronJob}