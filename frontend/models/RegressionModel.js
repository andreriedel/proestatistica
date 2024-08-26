class RegressionModel {
  // Faz uma requisição ao servidor para obter as planilhas de um determinado arquivo.
  getSheets(filePath, callback) {
    fetch("http://localhost:5000/regressiongetsheets", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath: filePath })
    })
    .then(response => response.json())
    .then(data => {
      callback(data); // Passa a resposta do servidor para uma função callback.
    })
    .catch(error => {
        console.error('Erro ao enviar dados ao backend:', error);
    });
  }

  // Faz uma requisição ao servidor para obter as colunas de uma determinada planilha.
  getCols(sheet, callback) {
    fetch("http://localhost:5000/regressiongetcols", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sheet: sheet })
    })
    .then(response => response.json())
    .then(data => {
      callback(data); // Passa a resposta do servidor para uma função callback.
    })
    .catch(error => {
        console.error('Erro ao enviar dados ao backend:', error);
    });
  }

  // Faz uma requisição ao servidor passando todos os dados do formulário.
  submitForm(formData, callback) {
    fetch("http://localhost:5000/regressionsubmitform", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then((data) => {
      callback(data); // Passa a resposta do servidor para uma função callback.
    })
    .catch(error => {
        console.error('Erro ao enviar dados ao backend:', error);
    });
  }
}
