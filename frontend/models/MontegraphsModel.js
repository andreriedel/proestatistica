class MontegraphsModel {
  getURLparams() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    return JSON.parse(decodeURIComponent(dataParam));
  }
}
