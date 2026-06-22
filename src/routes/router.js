import { Router } from "express";
import produtoRoutes from "./produtosRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import imagemProdutoRouter from "./imagemProduto.routes.js";

const routes = Router();

routes.use("/produtos", produtoRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/pedidos", pedidoRoutes);
routes.use("/itens", pedidoRoutes);
routes.use("/images", imagemProdutoRouter);


export default routes;