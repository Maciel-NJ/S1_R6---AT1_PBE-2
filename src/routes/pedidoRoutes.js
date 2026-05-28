import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";

const pedidoRoutes = Router();

pedidoRoutes.get("/", pedidoController.listarPedidos);
pedidoRoutes.post("/", pedidoController.criarPedido);

pedidoRoutes.get("/itens", pedidoController.listarItens);
pedidoRoutes.post("/:pedidoId/itens", pedidoController.criarItem);

pedidoRoutes.get( "/:id", pedidoController.listarIDPedidos);
pedidoRoutes.put("/:id", pedidoController.atualizarPedido);
pedidoRoutes.delete("/:id", pedidoController.deletarPedido);



pedidoRoutes.get("/itens/:id", pedidoController.listarIDItem);
pedidoRoutes.put("/itens/:id", pedidoController.alterarItem); // esse id é o id do item, não do pedido
pedidoRoutes.delete("/itens/:id", pedidoController.deletarItem);



export default pedidoRoutes;
