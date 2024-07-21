const validateRequest = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      res.status(400).json({
        success: false,
        code: 400,
        message: err.errors[0],
      });
    }
  };
  
  module.exports = validateRequest;