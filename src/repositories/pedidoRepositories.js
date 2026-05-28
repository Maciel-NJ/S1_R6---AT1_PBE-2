import { connection } from "../config/Database.js";

const pedidoRepositories = {
  criarPedido: async (pedido, itemPed) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // --- INSERT PEDIDO --- //
      const sqlPedido = "INSERT INTO pedidos (Subtotal, Status) VALUES (?, ?);";
      const valuesPedido = [pedido.subTotal, pedido.status];
      const [rowsPedido] = await conn.execute(sqlPedido, valuesPedido);

      // --- INSERT ITENS_PEDIDO --- //
      for (const item of itemPed) {
        const sqlItemPed =
          "INSERT INTO itens_pedidos (idPedido, idProduto, quantidade, valorItem) VALUES (?, ?, ?, ?);";
        const valuesItemPed = [
          rowsPedido.insertId,
          item.idProduto,
          item.quantidade,
          item.valorItem,
        ];
        await conn.execute(sqlItemPed, valuesItemPed);
      }

      await conn.commit();
      return rowsPedido;
    } catch (error) {
      await conn.rollback();
      throw new Error(error);
    } finally {
      conn.release();
    }
  },
  listarPedidos: async () => {
    const sql = "SELECT * FROM pedidos;";
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDPedido: async (id) => {
    const sql = "SELECT * FROM pedidos WHERE idPedido = ?;";
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarPedido: async (pedido) => {
    const sql = "UPDATE pedidos SET status = ? WHERE idPedido = ?;";
    const values = [pedido.status, pedido.id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarStatusPedido: async (pedido) => {
    const sql = "UPDATE pedidos SET Status = ? WHERE idPedido = ?;";
    const values = [pedido.status, pedido.id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  deletarPedido: async (id) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // --- DELETE ITENS DO PEDIDO --- //
      const sqlDeleteItens = "DELETE FROM itens_pedidos WHERE idPedido = ?;";
      await conn.execute(sqlDeleteItens, [id]);

      // --- DELETE PEDIDO --- //
      const sqlDeletePedido = "DELETE FROM pedidos WHERE idPedido = ?;";
      const [rows] = await conn.execute(sqlDeletePedido, [id]);

      await conn.commit();
      return rows;
    } catch (error) {
      await conn.rollback();
      throw new Error(error);
    } finally {
      conn.release();
    }
  },

  // --- Itens Pedidos --- //

  listarItensPorPedido: async (pedidoId) => {
    const sql = "SELECT * FROM itens_pedidos WHERE idPedido = ?;";
    const values = [pedidoId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  listarItens: async () => {
    const sql = "SELECT * FROM itens_pedidos;";
    const [rows] = await connection.execute(sql);
    return rows;
  },
  listarIDItem: async (id) => {
    const sql = "SELECT * FROM itens_pedidos WHERE idItensPedidos = ?;";
    const values = [id];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },
  alterarItem: async (itemId, pedidoId, item) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // --- UPDATE ITEM --- //
      const sqlUpdate =
        "UPDATE itens_pedidos SET idProduto = ?, Quantidade = ?, ValorItem = ? WHERE idItensPedidos = ?;";
      const valuesUpdate = [
        item.idProduto,
        item.quantidade,
        item.valorItem,
        itemId,
        pedidoId,
      ];
      await conn.execute(sqlUpdate, valuesUpdate);

      // --- RECALCULAR SUBTOTAL --- //
      const sqlSubtotal =
        "SELECT COALESCE(SUM(Quantidade * ValorItem), 0) AS novoSubtotal FROM itens_pedidos WHERE idPedido = ?;";
      const [subtotalRows] = await conn.execute(sqlSubtotal, [pedidoId]);
      const novoSubtotal = subtotalRows[0].novoSubtotal;

      // --- UPDATE PEDIDO SUBTOTAL --- //
      const sqlUpdatePedido =
        "UPDATE pedidos SET Subtotal = ? WHERE idPedido = ?;";
      await conn.execute(sqlUpdatePedido, [novoSubtotal, pedidoId]);

      await conn.commit();
      return { pedidoId, novoSubtotal };
    } catch (error) {
      await conn.rollback();
      throw new Error(error);
    } finally {
      conn.release();
    }
  },
  deletarItem: async (itemId) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      // --- BUSCAR PEDIDO DO ITEM --- //
      const sqlGetItem = "SELECT idPedido FROM itens_pedidos WHERE idItensPedidos = ?;";
      const [itemRows] = await conn.execute(sqlGetItem, [itemId]);

      if (!itemRows.length) {
        throw new Error("Item não encontrado");
      }

      const pedidoId = itemRows[0].idPedido;

      // --- DELETE ITEM --- //
      const sqlDeleteItem = "DELETE FROM itens_pedidos WHERE idItensPedidos = ?;";
      await conn.execute(sqlDeleteItem, [itemId]);

      // --- RECALCULAR SUBTOTAL --- //
      const sqlSubtotal =
        "SELECT COALESCE(SUM(Quantidade * ValorItem), 0) AS novoSubtotal FROM itens_pedidos WHERE idPedido = ?;";
      const [subtotalRows] = await conn.execute(sqlSubtotal, [pedidoId]);
      const novoSubtotal = subtotalRows[0].novoSubtotal;

      // --- UPDATE PEDIDO SUBTOTAL --- //
      const sqlUpdatePedido =
        "UPDATE pedidos SET Subtotal = ? WHERE idPedido = ?;";
      await conn.execute(sqlUpdatePedido, [novoSubtotal, pedidoId]);

      await conn.commit();
      return { pedidoId, novoSubtotal };
    } catch (error) {
      await conn.rollback();
      throw new Error(error);
    } finally {
      conn.release();
    }
  },
};

export default pedidoRepositories;
