class SixpackView {
  constructor() {
    // Atributos que armazenam os campos do formulário.
    this._sixpackFormEl = document.querySelector("#sixpack-form");
    this._fileEl = document.querySelector("#sp-file");
    this._sheetEl = document.querySelector("#sp-sheet");
    this._subprocessesColEl = document.querySelector("#sp-subprocesses-col");
    this._subprocessEl = document.querySelector("#sp-subprocess");
    this._subgroupsColEl = document.querySelector("#sp-subgroups-col");
    this._subgroupEl = document.querySelector("#sp-subgroup");
    this._valuesColEl = document.querySelector("#sp-values-col");
    this._lieEl = document.querySelector("#sp-lie");
    this._lseEl = document.querySelector("#sp-lse");
    this._submitEl = document.querySelector("#sp-submit");
  }

  /* -------------------------------- setters ------------------------------- */

  set sixpackFormEl(value) { this._sixpackFormEl = value; }
  set fileEl(value) { this._fileEl = value; }
  set sheetEl(value) { this._sheetEl = value; }
  set subprocessesColEl(value) { this._subprocessesColEl = value; }
  set subprocessEl(value) { this._subprocessEl = value; }
  set subgroupsColEl(value) { this._subgroupsColEl = value; }
  set subgroupEl(value) { this._subgroupEl = value; }
  set valuesColEl(value) { this._valuesColEl = value; }
  set lieEl(value) { this._lieEl = value; }
  set lseEl(value) { this._lseEl = value; }
  set submitEl(value) { this._submitEl = value; }

  /* -------------------------------- getters ------------------------------- */

  get sixpackFormEl() { return this._sixpackFormEl; }
  get fileEl() { return this._fileEl; }
  get sheetEl() { return this._sheetEl; }
  get subprocessesColEl() { return this._subprocessesColEl; }
  get subprocessEl() { return this._subprocessEl; }
  get subgroupsColEl() { return this._subgroupsColEl; }
  get subgroupEl() { return this._subgroupEl; }
  get valuesColEl() { return this._valuesColEl; }
  get lieEl() { return this._lieEl; }
  get lseEl() { return this._lseEl; }
  get submitEl() { return this._submitEl; }

  /* --------------------------- cleaning methods --------------------------- */

  // Limpa o campo file.
  cleanFileEl() {
    this._fileEl.value = "";   
  }

  // Limpa o campo sheet.
  cleanSheetEl() {
    this._sheetEl.innerHTML = "";
  }

  // Limpa os campos de coluna.
  cleanColsEl() {
    this._subprocessesColEl.innerHTML = "";
    this._subgroupsColEl.innerHTML = "";
    this._valuesColEl.innerHTML = "";
  }

  // Limpa o campo subprocess.
  cleanSubprocessEl() {
    this._subprocessEl.innerHTML = "";
  }

  // Limpa o campo subgroup.
  cleanSubgroupEl() {
    this._subgroupEl.innerHTML = "";
  }

  /* -------------------------- activation methods -------------------------- */

  // Ativa o campo file.
  activateFileEl() {
    this._fileEl.disabled = false;
  }

  // Ativa o campo sheet.
  activateSheetEl() {
    this._sheetEl.disabled = false;
  }

  // Ativa os campos de coluna.
  activateColsEl() {
    this._subprocessesColEl.disabled = false;
    this._subgroupsColEl.disabled = false;
    this._valuesColEl.disabled = false;
  }

  // Ativa o campo subprocess.
  activateSubprocessEl() {
    this._subprocessEl.disabled = false;
  }

  // Ativa o campo subgroup.
  activateSubgroupEl() {
    this._subgroupEl.disabled = false;
  }

  // Ativa o campo submit.
  activateSubmitEl() {
    this._submitEl.disabled = false;
  }

  /* ------------------------- deactivation methods ------------------------- */

  // O campo file nunca é desativado após ser ativado pela primeira vez.

  // Desativa o campo sheet.
  deactivateSheetEl() {
    this._sheetEl.disabled = true;
    this._sheetEl.classList.remove("border-success"); // Remove a classe se houver.
  }

  // Desativa os campos de coluna.
  deactivateColsEl() {   
    this._subprocessesColEl.disabled = true;
    this._subgroupsColEl.disabled = true;
    this._valuesColEl.disabled = true;

    this._subprocessesColEl.classList.remove("border-success"); // Remove a classe se houver.
    this._subgroupsColEl.classList.remove("border-success"); // Remove a classe se houver.
    this._valuesColEl.classList.remove("border-success"); // Remove a classe se houver.
  }

  // Desativa o campo subprocess.
  deactivateSubprocessEl() {
    this._subprocessEl.disabled = true;
    this._subprocessEl.classList.remove("border-success"); // Remove a classe se houver.
  }

  // Desativa o campo subgroup.
  deactivateSubgroupEl() {
    this._subgroupEl.disabled = true;
    this._subgroupEl.classList.remove("border-success"); // Remove a classe se houver.
  }

  // Desativa o campo submit.
  deactivateSubmitEl() {
    this._submitEl.disabled = true;
  }

  /* --------------------------- appending methods -------------------------- */

  // Adiciona as planilhas no campo sheets.
  appendSheets(sheets) {
    const emptyOption = document.createElement("option"); // Opção vazia necessária para o evento "change".
    emptyOption.value = "";
    emptyOption.text = "Selecione uma opção";
    emptyOption.style.color = "#ccc"; // Cor cinza para diferenciar.
    this._sheetEl.appendChild(emptyOption); // Adiciona a opção vazia.

    // Percorre todas as planilhas.
    sheets.forEach((sheet) => {
      const option = document.createElement("option");
      option.value = sheet;
      option.text = sheet;
      this._sheetEl.appendChild(option); // Adiciona a planilha como opção do campo.
    });
  }

  // Adiciona as colunas nos campos de coluna.
  appendCols(cols) {
    const emptyOptions = []; // Array de opções vazias, necessário para o evento "change".

    for (let i = 0; i < 3; i++) {
      emptyOptions.push(document.createElement("option"));
      emptyOptions[i].value = "";
      emptyOptions[i].text = "Selecione uma opção";
      emptyOptions[i].style.color = "#ccc"; // Cor cinza para diferenciar.
    }

    // Adiciona nos campos as opções vazias criadas.
    this._subprocessesColEl.appendChild(emptyOptions[0]);
    this._subgroupsColEl.appendChild(emptyOptions[1]);
    this._valuesColEl.appendChild(emptyOptions[2])
    
    let options = []; // Array que armazena 3 opções para os 3 campos de colunas.

    // Percorre todas as colunas.
    cols.forEach((col) => {
      for (let i = 0; i < 3; i++) {
        options.push(document.createElement("option"));  
        options[i].value = col;
        options[i].text = col;
      }

      // Adiciona as colunas como opções dos campos.
      this._subprocessesColEl.appendChild(options[0]);
      this._subgroupsColEl.appendChild(options[1]);
      this._valuesColEl.appendChild(options[2]);

      options = []; // Limpa o array.
    });
  }

  // Adiciona os subprocessos no campo subprocess.
  appendSubprocesses(subprocesses) {
    const emptyOption = document.createElement("option"); // Opção vazia necessária para o evento "change".
    emptyOption.value = "";
    emptyOption.text = "Selecione uma opção";
    emptyOption.style.color = "#ccc"; // Cor cinza para diferenciar.
    this._subprocessEl.appendChild(emptyOption);

    // Percorre todos os subprocessos.
    subprocesses.sort().forEach((subprocess) => {
      const option = document.createElement("option");
      option.value = subprocess;
      option.text = subprocess;
      this._subprocessEl.appendChild(option); // Adiciona o subprocesso como opção do campo.
    });
  }

  // Adiciona os subgrupos no campo subgroup.
  appendSubgroups(subgroups) {
    const emptyOption = document.createElement("option"); // Opção vazia necessária para o evento "change".
    emptyOption.value = "";
    emptyOption.text = "Selecione uma opção";
    emptyOption.style.color = "#ccc"; // Cor cinza para diferenciar.
    this._subgroupEl.appendChild(emptyOption);

    // Percorre todos os subgrupos.
    subgroups.sort().forEach((subgroup) => {
      const option = document.createElement("option");
      option.value = subgroup;
      option.text = subgroup;
      this._subgroupEl.appendChild(option); // Adiciona o subgrupo como opção do campo.
    });
  }

  /* ------------------------------------------------------------------------ */

  // Remove as colunas (opções) que já estejam selecionadas em outro campo de coluna.
  removeAlreadySelectedCols(allCols) {
    const fields = []; // Array que armazena os campos de coluna.
    const currentOptions = []; // Array que armazena as opções atualmente selecionadas nos campos de coluna.
    
    // Adiciona os campos existentes no array fields.
    fields.push(this._subprocessesColEl);
    fields.push(this._subgroupsColEl);
    fields.push(this._valuesColEl);
    
    fields.forEach((field) => {
      // Adiciona os valores atuais de cada campo no array currentOptions.
      currentOptions.push(field.value);
    });

    // Filtra o array currentOptions para que ele não tenha valores vazios.
    const currentOptionsFiltered = currentOptions.filter((option) => option != "");

    fields.forEach((field, i) => {
      const fieldAllOptions = []; // Array para armazenar todas as opções disponíveis no campo.

      [...field].forEach((option) => {
          // Adicona todas as opções disponíveis no array fieldAllOptions.
          fieldAllOptions.push(option.value);
      });

      // Percorre todas as colunas disponiveis.
      fieldAllOptions.forEach((col, j) => {
        // Bloco caso a opção já tenha sido selecionada em outro campo.
        if (currentOptionsFiltered.includes(col) && col != currentOptions[i]) {
          // Remove a opção caso ela esteja selecionada em outro elemento.
          field.remove(j); // REVIEW: verificar se está sendo removido correntamente.
        }
      })

      // Percorre todas as colunas disponiveis.
      allCols.forEach((col, j) => {
        // Bloco caso esteja faltando uma opção por ter sido removida anteriormente.
        if (!fieldAllOptions.includes(col) && !currentOptionsFiltered.includes(col)) {
          // Cria o elemento de opção para ser inserido.
          const option = document.createElement("option");
          option.value = col;
          option.text = col;

          let newOptionIdx = allCols.length; // REVIEW: Índice de onde a nova opção será inserida.

          for (let z = j + 1; z < allCols.length; z++) {
            if (fieldAllOptions.findIndex((el) => el == allCols[z]) > -1) {
              newOptionIdx = fieldAllOptions.findIndex((el) => el == allCols[z]);
              break;
            }
          }

          field.add(option, newOptionIdx); // Adiciona a nova opção no índice correspondente.
        }        
      });
    });
  }

  /* ------------------------------------------------------------------------ */

  // Exibe o gif de loading de um elemento do formulário.
  showLoadingFieldGif(fields) {
    [...document.querySelectorAll(fields)].forEach((field) => {
      field.style.visibility = "visible";
    });
  }

  // Esconde o gif de loading de um elemento do formulário.
  hideLoadingFieldGif(fields) {
    [...document.querySelectorAll(fields)].forEach((field) => {
      field.style.visibility = "hidden";
    });
  }

  /* ------------------------------------------------------------------------ */

  // Exibe o gif de loading da página de resposta.
  showLoadingPageGif() {
    document.querySelector(".loading-page-box").style.visibility = "visible";
    document.querySelector(".loading-page-box img").style.visibility = "visible";
  }

  // Esconde o gif de loading da página de resposta.
  hideLoadingPageGif() {
    document.querySelector(".loading-page-box").style.visibility = "hidden";
    document.querySelector(".loading-page-box img").style.visibility = "hidden";
  }
}
