import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagemProduto = {
  exibirImagem: async (req, res) => {
    try {
      const { nome } = req.params;
      const caminhoAbsoluto = path.join(
        __dirname,
        "../../uploads/images/",
        nome,
      );

      return res.sendFile(caminhoAbsoluto, error => {
        if (error) {
          res.status(404).json({
            message: "Imagem nao encontrada",
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Ocorreu um erro no servidor",
      });
    }
  },
};
export default imagemProduto;