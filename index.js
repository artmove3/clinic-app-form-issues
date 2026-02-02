const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require("./notes.controller");
const { addUser, loginUser } = require("./user.controller");

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
      title: "Express App",
      error: undefined,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

// register

app.get("/register", async (req, res) => {
  try {
    res.render("register", {
      title: "Express App",
      error: undefined,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

// add user

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      console.log("Register error", e);
      res.render("register", {
        title: "Express App",
        error: "Email is already registered",
      });

      return;
    }
    console.log("Register error", e);
    res.render("register", {
      title: "Express App",
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
    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/login");
});

// ставим авторизацию после обработки логина или регистрации
// на главную получают доступ только залогиненные пользователи

app.use(auth);

// main page

app.get("/", async (req, res) => {
  try {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    console.log("Loading error", e);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Creation error", e);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.put("/:id", async (req, res) => {
  try {
    console.log(req.body, req.user);
    await editNote(req.params.id, req.body.title, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await removeNote(req.params.id1, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,

      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message11,
    });
  }
});
// подключаем через MongoDB Atlas, выбираем кластер, нажимаем Connect, оттуда копируем строчку для первого параметра
// только после подключения к DB запускаем приложение
mongoose
  .connect(
    "mongodb+srv://artmove3_db_user:vtcQgZq2AYe5rURJ@cluster0.3tqzmmo.mongodb.net/notes?appName=Cluster0",
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`server has been started on port ${port}...`));
    });
  });
