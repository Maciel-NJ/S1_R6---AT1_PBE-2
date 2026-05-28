import pedidoRepositories from "../repositories/pedidoRepositories.js";
import { Pedido } from "../models/Pedido.js";
import { ItensPedido } from "../models/Item_Pedido.js";
import { statusPedido } from "../enum/statusPedido.js";

const pedidoController = {

  // PEDIDOS
  // =========================

  listarPedidos: async (req, res) => {
    try {

      const result = await pedidoRepositories.listarPedidos();

      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Nenhum pedido encontrado.",
          pedidos: []
        });
      }

      return res.status(200).json({
        success: true,
        message: "Pedidos listados com sucesso!",
        pedidos: result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao listar pedidos.",
        error: error.message
      });

    }
  },

  listarIDPedidos: async (req, res) => {
    try {

      const id = Number(req.params.id);

      const result = await pedidoRepositories.listarIDPedido(id);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Pedido encontrado com sucesso!",
        pedido: result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao buscar pedido.",
        error: error.message
      });

    }
  },

  criarPedido: async (req, res) => {
    try {

      const { itens } = req.body;

      if (!itens || itens.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Informe ao menos um item para o pedido."
        });
      }

      const itensPedido = itens.map((item) => {

        return ItensPedido.criar({
          idProduto: item.idProduto,
          quantidade: item.quantidade,
          valorItem: item.valorItem
        });

      });

      const subTotalItens =
        ItensPedido.calcularSubTotal(itensPedido);

      const pedido = Pedido.criar({
        subTotal: subTotalItens,
        status: statusPedido.ABERTO
      });

      const result =
        await pedidoRepositories.criarPedido(
          pedido,
          itensPedido
        );

      return res.status(201).json({
        success: true,
        message: "Pedido criado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao criar pedido.",
        error: error.message
      });

    }
  },

  atualizarPedido: async (req, res) => {
    try {

      const id = Number(req.params.id);

      const { status } = req.body;

      const statusValidos = statusPedido;

      if (
        !status ||
        (
          status !== statusValidos.ABERTO &&
          status !== statusValidos.FINALIZADO &&
          status !== statusValidos.PENDENTE
        )
      ) {

        return res.status(400).json({
          success: false,
          message: "Status inválido."
        });

      }

      const pedido =
        Pedido.editar({ status }, id);

      const result =
        await pedidoRepositories.alterarStatusPedido(
          pedido
        );

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado."
        });

      }

      return res.status(200).json({
        success: true,
        message: "Pedido atualizado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar pedido.",
        error: error.message
      });

    }
  },

  deletarPedido: async (req, res) => {
    try {

      const id = Number(req.params.id);

      if (!id || isNaN(id) || id <= 0) {

        return res.status(400).json({
          success: false,
          message: "ID inválido."
        });

      }

      const pedido =
        await pedidoRepositories.listarIDPedido(id);

      if (pedido.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado."
        });

      }

      const result =
        await pedidoRepositories.deletarPedido(id);

      return res.status(200).json({
        success: true,
        message: "Pedido deletado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao deletar pedido.",
        error: error.message
      });

    }
  },

 
  // ITENS PEDIDO
  // =========================

  listarItens: async (req, res) => {
    try {

      const result =
        await pedidoRepositories.listarItens();

      if (result.length === 0) {

        return res.status(200).json({
          success: true,
          message: "Nenhum item encontrado.",
          itens: []
        });

      }

      return res.status(200).json({
        success: true,
        message: "Itens listados com sucesso!",
        itens: result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao listar itens.",
        error: error.message
      });

    }
  },

  listarIDItem: async (req, res) => {
    try {

      const id = Number(req.params.id);

      const result =
        await pedidoRepositories.listarIDItem(id);

      if (result.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Item não encontrado."
        });

      }

      return res.status(200).json({
        success: true,
        message: "Item encontrado com sucesso!",
        item: result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao buscar item.",
        error: error.message
      });

    }
  },

  alterarItem: async (req, res) => {
    try {

      const itemId = Number(req.params.id);

      const {
        pedidoId,
        idProduto,
        quantidade,
        valorItem
      } = req.body;

      const item = ItensPedido.editar(
        {
          idProduto,
          quantidade,
          valorItem
        },
        itemId
      );

      const result =
        await pedidoRepositories.alterarItem(
          itemId,
          pedidoId,
          item
        );

      return res.status(200).json({
        success: true,
        message: "Item atualizado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar item.",
        error: error.message
      });

    }
  },

  criarItem: async (req, res) => {
    try {

      const { pedidoId } = req.params;

      const {
        idProduto,
        quantidade,
        valorItem
      } = req.body;

      const item = ItensPedido.criar({
        idProduto,
        quantidade,
        valorItem
      });

      const result =
        await pedidoRepositories.criarItem(
          pedidoId,
          item
        );

      return res.status(201).json({
        success: true,
        message: "Item criado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao criar item.",
        error: error.message
      });

    }
  },

  deletarItem: async (req, res) => {
    try {

      const itemId = Number(req.params.id);

      const result =
        await pedidoRepositories.deletarItem(itemId);

      return res.status(200).json({
        success: true,
        message: "Item deletado com sucesso!",
        result
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Erro ao deletar item.",
        error: error.message
      });

    }
  }

};

export default pedidoController;