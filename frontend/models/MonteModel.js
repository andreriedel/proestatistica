class MonteModel {
  // Faz uma requisição ao servidor para obter as planilhas de um determinado arquivo.
  getSheets(filePath, callback) {
    fetch("http://localhost:5000/montegetsheets", {
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
    fetch("http://localhost:5000/montegetcols", {
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

  // Faz uma requisição ao servidor para obter os subprocessos de uma determinada coluna.
  getSubprocesses(subprocessesCol, callback) {
    fetch("http://localhost:5000/montegetsubprocesses", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subprocessesCol: subprocessesCol })
    })
    .then(response => response.json())
    .then(data => {
      callback(data); // Passa a resposta do servidor para uma função callback.
    })
    .catch(error => {
        console.error('Erro ao enviar dados ao backend:', error);
    });
  }
  
  // Faz uma requisição ao servidor para obter os subgrupos de uma determinada
  // coluna relacionados aos subprocessos escolhidos.
  getSubgroups(subgroupsCol, subprocesses, callback) {
    fetch("http://localhost:5000/montegetsubgroups", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subgroupsCol: subgroupsCol,
        subprocesses: subprocesses
      })
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
  // A resposta do servidor é a simulação de Monte Carlo.
  submitForm(formData, callback) {
    fetch("http://localhost:5000/montesubmitform", {
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
