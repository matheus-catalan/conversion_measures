const express = require("express")
const os = require("os")
const app = express()
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")
const conversor = require("./convert")
const bodyParser = require("body-parser")
const config = require("./config/system-life")

app.use(config.middlewares.healthMid)
app.use("/", config.routers)
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/cm/:valor/mt", (req, res) => {
  let valor = req.params.valor
  let mt = conversor.cm_mt(valor)
  res.json({ metros: mt, maquina: os.hostname() })
})

app.get("/metros/:valor/cm", (req, res) => {
  let valor = req.params.valor
  let cm = conversor.mt_cm(valor)
  res.json({ centimetros: cm, maquina: os.hostname() })
})

app.get("/", (req, res) => {
  res.render("index", { valorConvertido: "" })
})

app.post("/", (req, res) => {
  let resultado = ""

  if (req.body.valorRef) {
    if (req.body.selectTemp == 1) {
      resultado = conversor.cm_mt(req.body.valorRef)
    } else {
      resultado = conversor.mt_cm(req.body.valorRef)
    }
  }

  res.render("index", { valorConvertido: resultado })
})

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080")
})
