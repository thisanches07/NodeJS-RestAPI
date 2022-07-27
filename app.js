const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const { default: mongoose } = require("mongoose");

const app = express();

//utilizado para capturar conteúdo JSON que chega para a API
app.use(bodyParser.json());
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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

mongoose
  .connect(
    "mongodb+srv://user123:pass123@cluster0.pjeyjhi.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
