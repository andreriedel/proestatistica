class AnovaController {
  constructor() {
    this.model = new AnovaModel();
    this.view = new AnovaView();

    this.filePath; // Atributo global para guardar o caminho do arquivo.
    this.allCols = []; // Atributo global para guardar todas as colunas de uma planilha.
  }

  /* ------------------------------------------------------------------------ */

  initialize() {
    this.view.anovaFormEl.reset(); // Reseta os campos do formulário sempre que a página carregar.
    this.view.activateFileEl(); // Ativa o campo file.
    this.view.deactivateSheetEl(); // Desativa o campo sheet.
    this.view.deactivateColsEl(); // Desativa os campos de coluna
    this.view.deactivateSubprocessEl(); // Desativa o campo subprocess.
    this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
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
      this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.

      this.view.cleanColsEl(); // Limpa os campos de coluna.
      this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
      this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.

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
      this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.

      this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
      this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.

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
        this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
        this.view.cleanSubprocessEl(); // Limpa o campo subprocess.
        this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
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
        this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
        this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
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
        this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
        this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
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

    // Evento de envio do formulário.
    this.view.anovaFormEl.addEventListener("submit", (event) => {
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

  /* ------------------------------------------------------------------------ */

  // Método que carrega os subgrupos de uma determinada coluna.
  loadSubgroups(subgroupsCol, subprocess) {
    this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
    this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
    this.view.showLoadingFieldGif("#loading-field-img-subgroups");
    this.model.getSubgroups(subgroupsCol, subprocess, (subgroups) => {
      this.view.appendSubgroups(subgroups);
      this.view.activateSubgroupsEl(); // Ativa o campo subgroups.
      this.listenSubgroupsChanges(); // Chama o método para perceber mudanças de seleção nas checkboxes dos subgrupos.
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
      this.view.hideLoadingFieldGif("#loading-field-img-subgroups");
    });
  }

  // Método para perceber mudanças de seleção nas checkboxes dos subgrupos.
  listenSubgroupsChanges() {
    [...this.view.subgroupsCheckboxesEl.children].forEach(el => {
      el.children[0].addEventListener("change", () => {
        this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
      });
    });
  }

  // Método que verifica se tem ao menos uma checkbox selecionada.
  isAnySubgroupSelected() {
    return [...this.view.subgroupsCheckboxesEl.children].some((el) => {
      return el.children[0].checked;
    });
  }

  // Método que retorna os subgrupos selecionados nas checkboxes.
  getSubgroupsSelected() {
    const subgroups = []; // Armazena somente as checkboxes marcadas.

    [...this.view.subgroupsCheckboxesEl.children].forEach((el) => {
      if (el.children[0].checked) {
        subgroups.push(el.children[0].value);
      }
    });

    return subgroups;
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
    fieldsValues.push(this.view.valuesColEl.value);

    for (const fieldValue of fieldsValues) {
      if (!fieldValue) { // Verifica se fieldValue possui valor.
        isValid = false; // Indica que o formulário não é válido.
        break;
      }
    }

    // Verifica se ao menos uma checkbox de subgrupo foi selecionada.
    if (!this.isAnySubgroupSelected())
      isValid = false;

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
    formData["valuesCol"] = this.view.valuesColEl.value;

    formData["subgroups"] = this.getSubgroupsSelected();

    // Envia os dados do formulário para o backend.
    this.model.submitForm(formData, (response) => {
        this.view.hideLoadingPageGif(); // Esconde o gif de loading.
        let url = "anovagraphs.html";
        window.location.href = url; // Envia para a outra página.
      }
    );
  }
}
