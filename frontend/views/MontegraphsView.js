class MontegraphsView {
  constructor() {
    this._resultsEl = document.querySelector("#mc-results");
  }

  getBestSubgroup(subprocess, data) {
    let max = 0;
    let bestSubgroup;

    data[1].forEach((subgroupObj, idx) => {
      if (subgroupObj["subprocess"] == subprocess) {
        if (subgroupObj["simulation"] > max) {
          max = subgroupObj["simulation"];
          bestSubgroup = subgroupObj;
        }
      }
    });

    return bestSubgroup;
  }

  getAllSimulations(subprocess, data) {
    let str = "";

    data[1].forEach((subgroupObj, idx) => {
      if (subgroupObj["subprocess"] == subprocess) {
        str += `
          <h5><u>${subgroupObj["subgroup"]}</u></h5>
          <h5>Simulação: ${subgroupObj["simulation"]}</h5>
          <img src="imgs/montecarlo-${subprocess.replace(/[ \/-]/g, '')}-${subgroupObj["subgroup"].replace(/[ \/-]/g, '')}.png" class="img-thumbnail my-3" alt="...">
          <hr>
        `;
      }
    });

    return str;
  }

  printResults(data) {
    data[0].forEach((subprocess, idx) => {
      const bestSubgroup = this.getBestSubgroup(subprocess, data);

      const resultCol = document.createElement("div");
      resultCol.classList.add("col-md-3", "m-3", "p-2", "border", "border-primary");      
      resultCol.innerHTML = `
        <h4>${subprocess}:</h4>
        <ul>
          <li>Melhor subgrupo: <u>${bestSubgroup["subgroup"]}</u></li>
          <li>Simulação: ${bestSubgroup["simulation"]}</li>
        </ul>

        <a href="#" data-bs-toggle="modal" data-bs-target="#modal-subprocess-${idx}">
          Ver todas as simulações
        </a>

        <!-- modal -->
        <div class="modal fade" id="modal-subprocess-${idx}" tabindex="-1" aria-labelledby="modal-label-subprocess-${idx}" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="modal-label-subprocess-${idx}">Simulações para ${subprocess}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
                ${this.getAllSimulations(subprocess, data)}
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this._resultsEl.appendChild(resultCol);
    });
  }
}
