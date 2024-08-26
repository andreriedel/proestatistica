class MontegraphsController {
  constructor() {
    this.model = new MontegraphsModel();
    this.view = new MontegraphsView();
  }

  initialize() {
    const data = this.model.getURLparams();
    this.view.printResults(data);
  }
}
