const bcrypt = require('bcryptjs');

const updateFields = async (body, user) => {
  const updatableFields = ['username', 'email', 'password'];
  
  for (let field of updatableFields) {
    if (body[field]) {
      if (field === 'password') {
        const salt = await bcrypt.genSalt(10);
        user[field] = await bcrypt.hash(body[field], salt);
      } else {
        user[field] = body[field];
      }
    }
  }

  return user;
};

module.exports = updateFields;