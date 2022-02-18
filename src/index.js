const express = require("express");

const {
  calculaComissaoController,
} = require("./controllers/calculaComissaoController");

const app = express();
const PORT = 3000;

const logger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
};

app.use(logger);
app.use(express.json());

//Rota para calculo da comissão
/*
  Opitei por criar um arquivo "Controller" para organização de código
*/
app.post("/api/calcula-comissao/", calculaComissaoController);

app.listen(PORT, () => {
  console.log(
    `[servidor]: O servidor está rodando em http://localhost:${PORT}`
  );
});
