class MonteController {
  constructor() {
    this.model = new MonteModel();
    this.view = new MonteView();

    this.filePath; // Atributo global para guardar o caminho do arquivo.
    this.allCols = []; // Atributo global para guardar todas as colunas de uma planilha.
  }

  /* ------------------------------------------------------------------------ */

  initialize() {
    this.view.monteFormEl.reset(); // Reseta os campos do formulário sempre que a página carregar.
    this.view.activateFileEl(); // Ativa o campo file.
    this.view.deactivateSheetEl(); // Desativa o campo sheet.
    this.view.deactivateColsEl(); // Desativa os campos de coluna
    this.view.deactivateSubprocessesEl(); // Desativa o campo subprocesses.
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
      this.view.deactivateSubprocessesEl(); // Desativa o campo subprocesses.
      this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.

      this.view.cleanColsEl(); // Limpa os campos de coluna.
      this.view.cleanSubprocessesEl(); // Limpa o campo subprocesses.
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

      this.view.deactivateSubprocessesEl(); // Desativa o campo subprocesses.
      this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.

      this.view.cleanSubprocessesEl(); // Limpa o campo subprocesses.
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
        this.view.deactivateSubprocessesEl(); // Desativa o campo subprocesses.
        this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
        this.view.cleanSubprocessesEl(); // Limpa o campo subprocesses.
        this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm();// Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo subgroupsCol.
    this.view.subgroupsColEl.addEventListener("change", () => {
      const subgroupsCol = this.view.subgroupsColEl.value;

      if (subgroupsCol) { // Verifica se foi selecionado uma opção.        
        this.view.subgroupsColEl.classList.add("border-success");

        // Verifica se já foi selecionado ao menos uma checkbox no campo subprocesses.
        // Esse bloco serve para controlar a relação entre os campos subprocesses e subgroupsCol.
        if (this.isAnySubprocessSelected()) {
          // Carrega os subgrupos da coluna de subgrupos referentes aos subprocessos.
          this.loadSubgroups(subgroupsCol, this.getSubprocessesSelected());
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
    
    // Evento de seleção do campo minCol.
    this.view.minColEl.addEventListener("change", () => {
      const minCol = this.view.minColEl.value;

      if (minCol) { // Verifica se foi selecionado uma opção.
        this.view.minColEl.classList.add("border-success");
      } else {
        this.view.minColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo meanCol.
    this.view.meanColEl.addEventListener("change", () => {
      const meanCol = this.view.meanColEl.value; 

      if (meanCol) { // Verifica se foi selecionado uma opção.
        this.view.meanColEl.classList.add("border-success");
      } else {
        this.view.meanColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de seleção do campo maxCol.
    this.view.maxColEl.addEventListener("change", () => {
      const maxCol = this.view.maxColEl.value; 

      if (maxCol) { // Verifica se foi selecionado uma opção.
        this.view.maxColEl.classList.add("border-success");
      } else {
        this.view.maxColEl.classList.remove("border-success");
      }

      // Chama o método que exclui as colunas que já foram selecionadas em outros campos.
      this.view.removeAlreadySelectedCols(this.allCols);
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
    });

    // Evento de envio do formulário.
    this.view.monteFormEl.addEventListener("submit", (event) => {
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
    this.view.deactivateSubprocessesEl(); // Desativa o campo subprocesses.
    this.view.cleanSubprocessesEl(); // Limpa o campo subprocesses.
    this.view.showLoadingFieldGif("#loading-field-img-subprocesses");
    this.model.getSubprocesses(subprocessesCol, (subprocesses) => {
      this.view.appendSubprocesses(subprocesses); // Carrega os subprocessos obtidos no campo.
      this.view.activateSubprocessesEl(); // Ativa o campo subprocesses.
      this.listenSubprocessesChanges(); // Chama o método para perceber mudanças de seleção nas checkboxes dos subprocessos.
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
      this.view.hideLoadingFieldGif("#loading-field-img-subprocesses");
    });
  }

  // Método para perceber mudanças de seleção nas checkboxes dos subprocessos.
  listenSubprocessesChanges() {
    // Percorre todas as checkboxes do campo subprocesses.
    [...this.view.subprocessesCheckboxesEl.children].forEach(el => {
      el.children[0].addEventListener("change", () => { // Adiciona o evento change em cada checkbox.
        const subgroupsCol = this.view.subgroupsColEl.value;

        // Verifica se já foi selecionado ao menos uma checkbox no campo subprocesses.
        // Esse bloco serve para controlar a relação entre os campos subprocesses e subgroupsCol.
        if (this.isAnySubprocessSelected()) {
          if (subgroupsCol) { // Verifica se foi selecionado uma opção no campo subgroupsCol.
             // Carrega os subgrupos da coluna de subgrupos referentes aos subprocessos.
            this.loadSubgroups(subgroupsCol, this.getSubprocessesSelected());
          }
        } else {
          this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
          this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
        }
        
        this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
      });
    });
  }

  // Método que verifica se tem ao menos uma checkbox selecionada.
  isAnySubprocessSelected() {
    return [...this.view.subprocessesCheckboxesEl.children].some((el) => {
      return el.children[0].checked;
    });
  }

  // Método que retorna os subprocessos selecionados nas checkboxes.
  getSubprocessesSelected() {
    const subprocesses = []; // Armazena somente as checkboxes marcadas.

    [...this.view.subprocessesCheckboxesEl.children].forEach((el) => {
      if (el.children[0].checked) {
        subprocesses.push(el.children[0].value);
      }
    });

    return subprocesses;
  }

  /* ------------------------------------------------------------------------ */

  // Método que carrega os subgrupos de uma determinada coluna.
  loadSubgroups(subgroupsCol, subprocesses) {
    this.view.deactivateSubgroupsEl(); // Desativa o campo subgroups.
    this.view.cleanSubgroupsEl(); // Limpa o campo subgroups.
    this.view.showLoadingFieldGif("#loading-field-img-subgroups");
    this.model.getSubgroups(subgroupsCol, subprocesses, (subgroupsPerSubprocesses) => {
      this.view.appendSubgroups(subgroupsPerSubprocesses);
      this.view.activateSubgroupsEl(); // Ativa o campo subgroups.
      this.listenSubgroupsChanges(); // Chama o método para perceber mudanças de seleção nas checkboxes dos subgrupos.
      this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
      this.view.hideLoadingFieldGif("#loading-field-img-subgroups");
    });
  }

  // Método para perceber mudanças de seleção nas checkboxes dos subgrupos.
  listenSubgroupsChanges() {
    [...this.view.subgroupsCheckboxesEl.children].forEach(el => {
      if (el.nodeName != "H6") { // REVIEW: fazer algo mais sofisticado.
        el.children[0].addEventListener("change", () => {
          this.validateForm(); // Chama o método que verifica se o formulário pode ser enviado.
        });
      }
    });
  }

  // Método que verifica se tem ao menos uma checkbox selecionada.
  isAnySubgroupSelected() {
    return [...this.view.subgroupsCheckboxesEl.children].some((el) => {
      if (el.nodeName != "H6") { // REVIEW: fazer algo mais sofisticado.
        return el.children[0].checked;
      }
    });
  }

  // Método que retorna os subgrupos selecionados nas checkboxes.
  // O método retorna um aray de objetos contendo os subgrupos e seus respectivos subprocessos.
  getSubgroupsSelected() {
    const subgroups = []; // Armazena somente as checkboxes marcadas.

    [...this.view.subgroupsCheckboxesEl.children].forEach((el) => {
      if (el.nodeName != "H6") { // REVIEW: fazer algo mais sofisticado.
        if (el.children[0].checked) {
          subgroups.push(el.dataset.subgroupInfo);
        }
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
    fieldsValues.push(this.view.subgroupsColEl.value);
    fieldsValues.push(this.view.minColEl.value);
    fieldsValues.push(this.view.meanColEl.value);
    fieldsValues.push(this.view.maxColEl.value);

    for (const fieldValue of fieldsValues) {
      if (!fieldValue) { // Verifica se fieldValue possui valor.
        isValid = false; // Indica que o formulário não é válido.
        break;
      }
    }

    // Verifica se ao menos uma checkbox de subprocesso foi selecionada.
    if (!this.isAnySubprocessSelected())
      isValid = false;

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
    formData["subgroupsCol"] = this.view.subgroupsColEl.value;
    formData["minCol"] = this.view.minColEl.value;
    formData["meanCol"] = this.view.meanColEl.value;
    formData["maxCol"] = this.view.maxColEl.value;

    formData["subprocesses"] = this.getSubprocessesSelected();
    formData["subgroups"] = this.getSubgroupsSelected(); // Obtém os subgrupos e seus respectivos subprocessos.

    if (this.view.minimizeEl.checked) { // Armazena se foi marcado minimizar ou maximizar.
      formData["minmax"] = "min";
    } else {
      formData["minmax"] = "max";
    }

    formData["minmaxper"] = this.view.minmaxperEl.value; // Armazena o valor percentual escolhido.

    // Envia os dados do formulário para o backend.
    this.model.submitForm(formData, (simulations) => {
        this.view.hideLoadingPageGif(); // Esconde o gif de loading.

        // Cria os parâmetros do método GET.
        let queryString = encodeURIComponent(JSON.stringify(simulations));

        // Passa com método get os valores obtido na simulação.
        let url = "montegraphs.html?data=" + queryString;
        window.location.href = url; // Envia para a outra página.
      }
    );
  }
}
