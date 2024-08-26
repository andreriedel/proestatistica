class RegressionController {
  constructor() {
    this.model = new RegressionModel();
    this.view = new RegressionView();

    this.filePath; // Atributo global para guardar o caminho do arquivo.
    this.allCols = []; // Atributo global para guardar todas as colunas de uma planilha.
  }

  /* ------------------------------------------------------------------------ */

  initialize() {
    this.view.regressionFormEl.reset(); // Reseta os campos do formulário sempre que a página carregar.
    this.view.activateFileEl(); // Ativa o campo file.
    this.view.deactivateSheetEl(); // Desativa o campo sheet.
    this.view.deactivateColsEl(); // Desativa os campos de coluna
    this.view.deactivateSubmitEl(); // Desativa o campo submit.

    // Evento de seleção do campo file.
    this.view.fileEl.addEventListener("change", () => {
      // Obtém o arquivo selecionado (o método retorna uma promessa).
      this.getFile()
      .then((filePath) => {
        this.view.fileEl.classList.add("border-success");
        this.filePath = filePath; // Atribui o caminho do arquivo ao atributo global.
        this.loadSheets(filePath); // Carrega as planilhas do arquivo.
      })
      .catch((event) => {
        this.view.fileEl.classList.remove("border-success");
        this.view.deactivateSheetEl(); // Desativa o campo sheet.
        this.view.cleanSheetEl(); // Limpa o campo sheet.
        this.view.cleanFileEl(); // Limpa o próprio campo file.
        alert(event); // Exibe na tela o evento de erro.
      });

      this.view.deactivateColsEl(); // Desativa os campos de coluna.
      this.view.cleanColsEl(); // Limpa os campos de coluna.

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo sheet.
    this.view.sheetEl.addEventListener("change", () => {
      const sheet =  this.view.sheetEl.value;

      if (sheet) { // Verifica se foi selecionado uma opção.
        this.view.sheetEl.classList.add("border-success");
        this.loadCols(sheet); // Carrega as colunas do arquivo.
      } else {
        this.view.sheetEl.classList.remove("border-success");
        this.view.deactivateColsEl(); // Desativa os campos de coluna.
        this.view.cleanColsEl(); // Limpa os campos de coluna.
      }

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo xCol.
    this.view.xColEl.addEventListener("change", () => {
      const xCol = this.view.xColEl.value;

      if (xCol) { // Verifica se foi selecionado uma opção.
        this.view.xColEl.classList.add("border-success");
      } else {
        this.view.xColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo xCol.
    this.view.yColEl.addEventListener("change", () => {
      const yCol = this.view.yColEl.value;

      if (yCol) { // Verifica se foi selecionado uma opção.
        this.view.yColEl.classList.add("border-success");
      } else {
        this.view.yColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de envio do formulário.
    this.view.regressionFormEl.addEventListener("submit", (event) => {
      event.preventDefault(); // Impede o comportamento padrão do formulário.
      this.view.showLoadingPageGif(); // Exibe o gif de loading.
      this.getFormValues(); // Obtém os dados do formulário.
    });
  }

  /* ------------------------------------------------------------------------ */

  // Lê o arquivo inserido.
  getFile() {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const file = this.view.fileEl.files[0];
      const allowedExtensions = ["xls", "xlsx", "xlsm", "xlt", "xml", "xlw", ]; // Extensões permitidas para arquivos Excel.

      // Verifica a extensão do arquivo.
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        reject("Tipo de arquivo não suportado. Por favor, selecione um arquivo Excel (.xls, .xlsx, etc.).");
        return;
      }
      
      if (file) { // Verifica se o arquivo existe.
        fileReader.readAsDataURL(file); // Lê o arquivo.
      } else {
        reject("Nenhum arquivo selecionado.");
        return;
      }

      fileReader.onload = () => { // Código executado após leitura do arquivo bem sucedida.
        const filePath = "data/" + file.name; // Pega o nome do arquivo e adiciona a pasta padrão de dados do projeto.
        resolve(filePath);
      };

      fileReader.onerror = (event) => { // Código executado após leitura do arquivo mal sucedida.
        reject(event);
      };
    });
  }

  // Método que carrega as planilhas de um determinado arquivo.
  loadSheets(filePath) {
    this.view.deactivateSheetEl(); // Desativa o campo sheet.
    this.view.cleanSheetEl(); // Limpa o campo sheet.
    this.view.showLoadingFieldGif("#loading-field-img-sheet");
    this.model.getSheets(filePath, (sheets) => {
      this.view.appendSheets(sheets); // Carrega as planilhas obtidas no campo.
      this.view.activateSheetEl(); // Ativa o campo sheet.
      this.view.hideLoadingFieldGif("#loading-field-img-sheet");
    });
  }

  // Método que carrega as colunas de uma determinada planilha.
  loadCols(sheet) {
    this.view.deactivateColsEl(); // Desativa os campos de coluna.
    this.view.cleanColsEl(); // Limpa os campos de coluna.
    this.view.showLoadingFieldGif(".loading-field-img-cols");
    this.model.getCols(sheet, (cols) => {
      this.allCols = cols; // Atribui todas as colunas ao atributo global.
      this.view.appendCols(cols); // Carrega as colunas obtidas no campo.
      this.view.activateColsEl(); // Ativa os campos de coluna.
      this.view.hideLoadingFieldGif(".loading-field-img-cols");
    });
  }

  /* ------------------------------------------------------------------------ */

  // Método que verifica se o formulário pode ser enviado.
  validateForm() {
    const fieldsValues = []; // Valroes dos campos do formulário.
    let isValid = true; // Flag para verificar se o formulário é válido para ser enviado.

    fieldsValues.push(this.view.fileEl.value);
    fieldsValues.push(this.view.sheetEl.value);
    fieldsValues.push(this.view.xColEl.value);
    fieldsValues.push(this.view.yColEl.value);

    for (const fieldValue of fieldsValues) {
      if (!fieldValue) { // Verifica se fieldValue possui valor.
        isValid = false; // Indica que o formulário não é válido.
        break;
      }
    }

    if (isValid) { // Verifica se o formulário é válido.
      this.view.activateSubmitEl(); // Ativa o botão submit.
    } else {
      this.view.deactivateSubmitEl(); // Desativa o botão submit.
    }
  }

  // Obtém os dados do formulário.
  getFormValues() {
    const formData = {}; // Objeto dos dados do formulário

    formData["filePath"] = this.filePath;
    formData["sheet"] = this.view.sheetEl.value;
    formData["xCol"] = this.view.xColEl.value;
    formData["yCol"] = this.view.yColEl.value;  

    // Envia os dados do formulário para o backend.
    this.model.submitForm(formData, (response) => {
        this.view.hideLoadingPageGif(); // Esconde o gif de loading.
        let url = "regressiongraphs.html";
        window.location.href = url; // Envia para a outra página.
      }
    );
  }
}
