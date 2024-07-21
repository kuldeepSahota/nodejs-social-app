const yup = require('yup');

const registerSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email('Email must be a valid email').required(),
    password: yup.string().required(),
})

const loginSchema = yup.object().shape({
    email: yup.string().email('Email must be a valid email').required(),
    password: yup.string().required(),
})

const updateUserSchema = yup.object().shape({
    id: yup.string().required(),
})

module.exports = {registerSchema,loginSchema,updateUserSchema};