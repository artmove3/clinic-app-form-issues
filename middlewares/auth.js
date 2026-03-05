const jwt = require("jsonwebtoken");
const { JWT_TEST } = require("../constants");

function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    // через jwt проверяем токен, получая его из объекта запроса
    // второй аргумент - секретное слово
    const verifyToken = jwt.verify(token, JWT_TEST);
    // добавляем в объект req чистый email юзера, если токен прошел проверку
    req.user = {
      email: verifyToken.email,
    };
    next();
  } catch (error) {
    res.redirect("/");
  }
}

module.exports = auth;
