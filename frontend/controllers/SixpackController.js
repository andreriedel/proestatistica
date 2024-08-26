class SixpackController {
  constructor() {
    this.model = new SixpackModel();
    this.view = new SixpackView();

    this.filePath; // Atributo global para guardar o caminho do arquivo.
    this.allCols = []; // Atributo global para guardar todas as colunas de uma planilha.
  }

  /* ------------------------------------------------------------------------ */

  initialize() {
    this.view.sixpackFormEl.reset(); // Reseta os campos do formulário sempre que a página carregar.
    this.view.activateFileEl(); // Ativa o campo file.
    this.view.deactivateSheetEl(); // Desativa o campo sheet.
    this.view.deactivateColsEl(); // Desativa os campos de coluna
    this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
    this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.
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
      this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
      this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.

      this.view.cleanColsEl(); // Limpa os campos de coluna.
      this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
      this.view.cleanSubgroupEl(); // Limpa o campo subgroup.

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

      this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
      this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.

      this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
      this.view.cleanSubgroupEl(); // Limpa o campo subgroup.

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo subprocessesCol.
    this.view.subprocessesColEl.addEventListener("change", () => {
      const subprocessesCol = this.view.subprocessesColEl.value;

      if (subprocessesCol) { // Verifica se foi selecionado uma opção.
        this.view.subprocessesColEl.classList.add("border-success");
        this.loadSubprocesses(subprocessesCol); // Carrega os subprocessos da coluna de subprocessos.
      } else {
        this.view.subprocessesColEl.classList.remove("border-success");
        this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
        this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.
        this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
        this.view.cleanSubgroupEl(); // Limpa o campo subgroup.
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm();// Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo subprocess.
    this.view.subprocessEl.addEventListener("change", () => {
      const subprocess = this.view.subprocessEl.value;

      if (subprocess) { // Verifica se foi selecionado uma opção.
        this.view.subprocessEl.classList.add("border-success");
        
        // Verifica se já foi selecionado uma opção no campo subgroupsCol.
        // Esse bloco serve para controlar a relação entre os campos subprocess e subgroupsCol.
        if (this.view.subgroupsColEl.value) {
          // Carrega os subgrupos da coluna de subgrupos referentes ao subprocesso.
          this.loadSubgroups(this.view.subgroupsColEl.value, subprocess);
        }
      } else {
        this.view.subprocessEl.classList.remove("border-success");
        this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.
        this.view.cleanSubgroupEl(); // Limpa o campo subgroup.
      }

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo subgroupsCol.
    this.view.subgroupsColEl.addEventListener("change", () => {
      const subgroupsCol = this.view.subgroupsColEl.value;

      if (subgroupsCol) { // Verifica se foi selecionado uma opção.        
        this.view.subgroupsColEl.classList.add("border-success");

        // Verifica se já foi selecionado uma opção no campo subprocess.
        // Esse bloco serve para controlar a relação entre os campos subprocess e subgroupsCol.
        if (this.view.subprocessEl.value) {
          // Carrega os subgrupos da coluna de subgrupos referentes ao subprocesso.
          this.loadSubgroups(subgroupsCol, this.view.subprocessEl.value);
        }
      } else {
        this.view.subgroupsColEl.classList.remove("border-success");
        this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.
        this.view.cleanSubgroupEl(); // Limpa o campo subgroup.
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo subgroup.
    this.view.subgroupEl.addEventListener("change", () => {
      const subgroup = this.view.subgroupEl.value;

      if (subgroup) { // Verifica se foi selecionado uma opção.
        this.view.subgroupEl.classList.add("border-success");
      } else {
        this.view.subgroupEl.classList.remove("border-success");
      }

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo valuesCol.
    this.view.valuesColEl.addEventListener("change", () => {
      const valuesCol = this.view.valuesColEl.value;

      if (valuesCol) { // Verifica se foi selecionado uma opção.
        this.view.valuesColEl.classList.add("border-success");
      } else {
        this.view.valuesColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo lie.
    this.view.lieEl.addEventListener("input", () => {
      const lie = this.view.lieEl.value;

      if (lie) { // Verifica se foi selecionado uma opção.
        this.view.lieEl.classList.add("border-success");
      } else {
        this.view.lieEl.classList.remove("border-success");
      }

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    })

    // Evento de seleção do campo lse.
    this.view.lseEl.addEventListener("input", () => {
      const lse = this.view.lseEl.value;

      if (lse) { // Verifica se foi selecionado uma opção.
        this.view.lseEl.classList.add("border-success");
      } else {
        this.view.lseEl.classList.remove("border-success");
      }

      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    })

    // Evento de envio do formulário.
    this.view.sixpackFormEl.addEventListener("submit", (event) => {
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

  // Método que carrega os subprocessos de uma determinada coluna.
  loadSubprocesses(subprocessesCol) {
    this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
    this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
    this.view.showLoadingFieldGif("#loading-field-img-subprocess");
    this.model.getSubprocesses(subprocessesCol, (subprocesses) => {
      this.view.appendSubprocesses(subprocesses); // Carrega os subprocessos obtidos no campo.
      this.view.activateSubprocessEl(); // Ativa o campo subprocess.
      this.view.hideLoadingFieldGif("#loading-field-img-subprocess");
    });
  }

  // Método que carrega os subgrupos de uma determinada coluna.
  loadSubgroups(subgroupsCol, subprocesses) {
    this.view.deactivateSubgroupEl(); // Desativa o campo subgroup.
    this.view.cleanSubgroupEl(); // Limpa o campo subgroup.
    this.view.showLoadingFieldGif("#loading-field-img-subgroup");
    this.model.getSubgroups(subgroupsCol, subprocesses, (subgroupsPerSubprocesses) => {
      this.view.appendSubgroups(subgroupsPerSubprocesses);
      this.view.activateSubgroupEl(); // Ativa o campo subgroup.
      this.view.hideLoadingFieldGif("#loading-field-img-subgroup");
    });
  }

  /* ------------------------------------------------------------------------ */

  // Método que verifica se o formulário pode ser enviado.
  validateForm() {
    const fieldsValues = []; // Valroes dos campos do formulário.
    let isValid = true; // Flag para verificar se o formulário é válido para ser enviado.

    fieldsValues.push(this.view.fileEl.value);
    fieldsValues.push(this.view.sheetEl.value);
    fieldsValues.push(this.view.subprocessesColEl.value);
    fieldsValues.push(this.view.subprocessEl.value);
    fieldsValues.push(this.view.subgroupsColEl.value);
    fieldsValues.push(this.view.subgroupEl.value);
    fieldsValues.push(this.view.valuesColEl.value);
    fieldsValues.push(this.view.lieEl.value);
    fieldsValues.push(this.view.lseEl.value);

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
    formData["subprocessesCol"] = this.view.subprocessesColEl.value;
    formData["subprocess"] = this.view.subprocessEl.value;
    formData["subgroupsCol"] = this.view.subgroupsColEl.value;
    formData["subgroup"] = this.view.subgroupEl.value;
    formData["valuesCol"] = this.view.valuesColEl.value;
    formData["lie"] = Number(this.view.lieEl.value); // Converte o input para número.
    formData["lse"] = Number(this.view.lseEl.value); // Converte o input para número.

    if (Number.isNaN(formData.lie)) { formData.lie = null; } // Caso não seja um número, atribui 0.
    if (Number.isNaN(formData.lse)) { formData.lse = null; } // Caso não seja um número, atribui 0.

    // Envia os dados do formulário para o backend.
    this.model.submitForm(formData, (response) => {
        this.view.hideLoadingPageGif(); // Esconde o gif de loading.
        let url = "sixpackgraphs.html";
        window.location.href = url; // Envia para a outra página.
      }
    );
  }
}
