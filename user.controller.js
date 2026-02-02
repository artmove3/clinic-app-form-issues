const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_TEST } = require("./constants");

async function addUser(email, password) {
  // первый аргумент - данные, которые нужно захешировать, второй - salt, или количество раундов для создания salt
  // https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, password: passwordHash });
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User is not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Wrong password");
  }
  // формируем токен как зашифровнный email
  // передаем объект на случай, если понадобится передать что-нибудь еще зашифрованное
  // expiresIn указывает время валидности токена
  return jwt.sign({ email }, JWT_TEST, {
    expiresIn: "30d",
  });
}

module.exports = { addUser, loginUser };
