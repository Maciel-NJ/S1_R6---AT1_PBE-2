import path from "path";
import fs from "fs";

const imagemProduto = {
  exibirImagem: async (req, res) => {
    try {
      const { nome } = req.params;

      const caminhoImagem = path.join(
        process.cwd(),
        "uploads",
        "images",
        nome
      );

      console.log(caminhoImagem);

      if (!fs.existsSync(caminhoImagem)) {
        return res.status(404).json({
          message: "Imagem não encontrada",
        });
      }

      return res.sendFile(caminhoImagem, (err) => {
        if (err) {
          console.error("sendFile error:", err);

          if (!res.headersSent) {
            return res.status(500).json({
              message: "Erro ao enviar imagem",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  },
};

export default imagemProduto;