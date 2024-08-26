class RegressionView {
  constructor() {
    // Atributos que armazenam os campos do formulário.
    this._regressionFormEl = document.querySelector("#regression-form");
    this._fileEl = document.querySelector("#ra-file");
    this._sheetEl = document.querySelector("#ra-sheet");
    this._xColEl = document.querySelector("#ra-x-col");
    this._yColEl = document.querySelector("#ra-y-col");
    this._submitEl = document.querySelector("#ra-submit");
  }

  /* -------------------------------- setters ------------------------------- */
  
  set regressionFormEl(value) { this._regressionFormEl = value; }
  set fileEl(value) { this._fileEl = value; }
  set sheetEl(value) { this._sheetEl = value; }
  set xColEl(value) { this._xColEl = value; }
  set yColEl(value) { this._yColEl = value; }
  set submitEl(value) { this.submitEl = value; }

  /* -------------------------------- getters ------------------------------- */

  get regressionFormEl() { return this._regressionFormEl; }
  get fileEl() { return this._fileEl; }
  get sheetEl() { return this._sheetEl; }
  get xColEl() { return this._xColEl; }
  get yColEl() { return this._yColEl; }
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
    this._xColEl.innerHTML = "";
    this._yColEl.innerHTML = "";
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
    this._xColEl.disabled = false;
    this._yColEl.disabled = false;
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
    this._xColEl.disabled = true;
    this._yColEl.disabled = true;

    this._xColEl.classList.remove("border-success"); // Remove a classe se houver.
    this._yColEl.classList.remove("border-success"); // Remove a classe se houver.
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

    for (let i = 0; i < 2; i++) {
      emptyOptions.push(document.createElement("option"));
      emptyOptions[i].value = "";
      emptyOptions[i].text = "Selecione uma opção";
      emptyOptions[i].style.color = "#ccc"; // Cor cinza para diferenciar.
    }

    // Adiciona nos campos as opções vazias criadas.
    this._xColEl.appendChild(emptyOptions[0]);
    this._yColEl.appendChild(emptyOptions[1]);
    
    let options = []; // Array que armazena 2 opções para os 2 campos de colunas.

    // Percorre todas as colunas.
    cols.forEach((col) => {
      for (let i = 0; i < 2; i++) {
        options.push(document.createElement("option"));  
        options[i].value = col;
        options[i].text = col;
      }

      // Adiciona as colunas como opções dos campos.
      this._xColEl.appendChild(options[0]);
      this._yColEl.appendChild(options[1]);

      options = []; // Limpa o array.
    });
  }

  /* ------------------------------------------------------------------------ */

  // Remove as colunas (opções) que já estejam selecionadas em outro campo de coluna.
  removeAlreadySelectedCols(allCols) {
    const fields = []; // Array que armazena os campos de coluna.
    const currentOptions = []; // Array que armazena as opções atualmente selecionadas nos campos de coluna.
    
    // Adiciona os campos existentes no array fields.
    fields.push(this._xColEl);
    fields.push(this._yColEl);
    
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
