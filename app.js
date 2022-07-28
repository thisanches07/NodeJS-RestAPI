const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//utilizado para capturar conteúdo JSON que chega para a API
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

//Middleware criado para evitar erro de CORS
app.use((req, res, next) => {
  //indica se os recursos da resposta podem ser compartilhados com a origin dada.
  res.setHeader("Access-Control-Allow-Origin", "*");

  //especifica o método ou métodos permitidos
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  //indicar quais cabeçalhos HTTP podem ser utilizados durante a requisição
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//capturando rotas de feed
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb+srv://user123:pass123@cluster0.pjeyjhi.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
