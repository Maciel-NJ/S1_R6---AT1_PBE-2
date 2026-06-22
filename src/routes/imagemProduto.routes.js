import imagemProduto from "../controllers/imagemProduto.controller.js";
import { Router } from "express";

const imagemProdutoRouter = Router();

imagemProdutoRouter.get("/imagem/:nome", imagemProduto.exibirImagem);
export default imagemProdutoRouter;