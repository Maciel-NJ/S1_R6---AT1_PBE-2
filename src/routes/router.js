import { Router } from "express";
import produtoRoutes from "./produtosRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import imagemProdutoRoutes from "./imagemProduto.routes.js";

const routes = Router();

routes.use("/produtos", produtoRoutes);
routes.use("/categorias", categoriaRoutes);
routes.use("/pedidos", pedidoRoutes);
routes.use("/itens", pedidoRoutes);
routes.use("/images", imagemProdutoRoutes);


export default routes;