const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const { loginUser } = require("./user.controller");
const { addIssue, getIssues } = require("./form-issue.controller");

//localhost:3000
const port = 3000;

const app = express();

// находим папку с страницами для отображения

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.join(__dirname, "public")));
// middleware для обработки cookie в express.js
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// login
app.get("/login", async (req, res) => {
  try {
    res.render("login", {
      title: "Login",
      error: undefined,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("login", {
      title: "Login",
      error: e.message,
    });
  }
});

// login user handler

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    // задаем в куки по имени 'token' зашифрованную строку из функции loginUser
    // hhtpOnly закрывает доступ к токену через консоль браузера
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/issues-table");
  } catch (e) {
    res.render("login", {
      title: "Login",
      error: e.message,
    });
  }
});

// main page

app.get("/", async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true });
    res.render("index", {
      title: "Запись к врачу",
      created: false,
      error: false,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("index", {
      title: "Запись к врачу",
      created: false,
      error: true,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    await addIssue(req.body.userName, req.body.phoneNumber, req.body.issueText);
    res.render("index", {
      title: "Запись к врачу",
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Creation error", e);
    res.render("index", {
      title: "Запись к врачу",
      created: false,
      error: true,
    });
  }
});

// Если пользователь не авторизован, то при попытке перехода на /issues-table будет перенаправлен на главную страницу

app.use(auth);

app.get("/issues-table", async (req, res) => {
  try {
    res.render("issuesTable", {
      title: "Заявки с формы",
      issues: await getIssues(),
      created: false,
      error: false,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("issuesTable", {
      title: "Заявки с формы",
      issues: undefined,
      created: false,
      error: true,
    });
  }
});

// подключаем через MongoDB Atlas, выбираем кластер, нажимаем Connect, оттуда копируем строчку для первого параметра
// только после подключения к DB запускаем приложение
mongoose
  .connect(
    "mongodb+srv://artmove3_db_user:vtcQgZq2AYe5rURJ@cluster0.3tqzmmo.mongodb.net/clinics_app?appName=Cluster0",
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`server has been started on port ${port}...`));
    });
  });
