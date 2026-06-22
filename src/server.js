import "dotenv/config";
import express from "express";
import routes from "./routes/router.js";
import cors from "cors";
// import { initializeDatabase } from "./config/Database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", routes);


app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Servidor rodando em: http://localhost:${process.env.SERVER_PORT}`,
  );
});

// initializeDatabase()
//   .then(() => {

//   })
//   .catch((err) => {
//     console.error("Erro ao inicializar o banco de dados:", err);
//   });