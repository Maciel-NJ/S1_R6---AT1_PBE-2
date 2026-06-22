import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagemProduto = {
  exibirImagem: async (req, res) => {
    try {
      const { nome } = req.params;
      const caminhoAbsoluto = path.join(
        __dirname,
        "../../uploads/images/",
        nome
      );

      if (!fs.existsSync(caminhoAbsoluto)) {
        return res.status(404).json({ message: "Imagem nao encontrada" });
      }

      return res.sendFile(caminhoAbsoluto, err => {
        if (err) {
          console.error('sendFile error:', err);
          if (!res.headersSent) {
            return res.status(500).json({ message: "Erro ao enviar imagem" });
          }
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },
};

export default imagemProduto;