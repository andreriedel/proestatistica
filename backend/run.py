from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.sixpack_controller import sixpack_controller
from controllers.anova_controller import anova_controller
from controllers.regression_controller import regression_controller
from controllers.monte_controller import monte_controller
from controllers.twovariance_controller import twovariance_controller

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas.

sixpack_controller = sixpack_controller()
anova_controller = anova_controller()
regression_controller = regression_controller()
monte_controller = monte_controller()
twovariance_controller = twovariance_controller()

@app.route('/sixpackgetsheets', methods=['POST'])
def sixpack_get_sheets():
    file_path = request.json['filePath'] # Obtém o dado passado na requisição.
    sheets = sixpack_controller.get_sheets(file_path) # Obtém as planilhas do arquivo.
    return jsonify(sheets) # Retorna a resposta do servidor.

@app.route('/sixpackgetcols', methods=['POST'])
def sixpack_get_cols():
    sheet = request.json['sheet'] # Obtém o dado passado na requisição.
    cols = sixpack_controller.get_cols(sheet) # Obtém as colunas da planilha.
    return jsonify(cols) # Retorna a resposta do servidor.

@app.route('/sixpackgetsubprocesses', methods=['POST'])
def sixpack_get_subprocesses():
    subprocesses_col = request.json['subprocessesCol'] # Obtém o dado passado na requisição.
    subprocesses = sixpack_controller.get_subprocesses(subprocesses_col) # Obtém os subprocessos da coluna.
    return jsonify(subprocesses) # Retorna a resposta do servidor.

@app.route('/sixpackgetsubgroups', methods=['POST'])
def sixpack_get_subgroups():
    subgroups_col = request.json['subgroupsCol'] # Obtém o dado passado na requisição.
    subprocess = request.json['subprocess'] # Obtém o dado passado na requisição.
    subgroups = sixpack_controller.get_subgroups(subgroups_col, subprocess) # Obtém os subgrupos da coluna.
    return jsonify(subgroups) # Retorna a resposta do servidor.

@app.route('/sixpacksubmitform', methods=['POST'])
def sixpack_submit_form():
    form_data = request.json # Obtém o dado passado na requisição.
    sixpack_controller.generate_capability_sixpack(form_data) # Gera os gráficos de capacidade.
    return jsonify("OK")

# ---------------------------------------------------------------------------- #

@app.route('/anovagetsheets', methods=['POST'])
def anova_get_sheets():
    file_path = request.json['filePath'] # Obtém o dado passado na requisição.
    sheets = anova_controller.get_sheets(file_path) # Obtém as planilhas do arquivo.
    return jsonify(sheets) # Retorna a resposta do servidor.

@app.route('/anovagetcols', methods=['POST'])
def anova_get_cols():
    sheet = request.json['sheet'] # Obtém o dado passado na requisição.
    cols = anova_controller.get_cols(sheet) # Obtém as colunas da planilha.
    return jsonify(cols) # Retorna a resposta do servidor.

@app.route('/anovagetsubprocesses', methods=['POST'])
def anova_get_subprocesses():
    subprocesses_col = request.json['subprocessesCol'] # Obtém o dado passado na requisição.
    subprocesses = anova_controller.get_subprocesses(subprocesses_col) # Obtém os subprocessos da coluna.
    return jsonify(subprocesses) # Retorna a resposta do servidor.

@app.route('/anovagetsubgroups', methods=['POST'])
def anova_get_subgroups():
    subgroups_col = request.json['subgroupsCol'] # Obtém o dado passado na requisição.
    subprocess = request.json['subprocess'] # Obtém o dado passado na requisição.
    subgroups = anova_controller.get_subgroups(subgroups_col, subprocess) # Obtém os subgrupos da coluna.
    return jsonify(subgroups) # Retorna a resposta do servidor.

@app.route('/anovasubmitform', methods=['POST'])
def anova_submit_form():
    form_data = request.json # Obtém o dado passado na requisição.
    anova_controller.generate_anova(form_data) # Gera a análise de variância.
    return jsonify("OK")

# ---------------------------------------------------------------------------- #

@app.route('/regressiongetsheets', methods=['POST'])
def regression_get_sheets():
    file_path = request.json['filePath'] # Obtém o dado passado na requisição.
    sheets = regression_controller.get_sheets(file_path) # Obtém as planilhas do arquivo.
    return jsonify(sheets) # Retorna a resposta do servidor.

@app.route('/regressiongetcols', methods=['POST'])
def regression_get_cols():
    sheet = request.json['sheet'] # Obtém o dado passado na requisição.
    cols = regression_controller.get_cols(sheet) # Obtém as colunas da planilha.
    return jsonify(cols) # Retorna a resposta do servidor.

@app.route('/regressionsubmitform', methods=['POST'])
def regression_submit_form():
    form_data = request.json # Obtém o dado passado na requisição.
    regression_controller.generate_regression_analysis(form_data) # Gera a análise de regressão.
    return jsonify("OK")

# ---------------------------------------------------------------------------- #

@app.route('/montegetsheets', methods=['POST'])
def monte_get_sheets():
    file_path = request.json['filePath'] # Obtém o dado passado na requisição.
    sheets = monte_controller.get_sheets(file_path) # Obtém as planilhas do arquivo.
    return jsonify(sheets) # Retorna a resposta do servidor.

@app.route('/montegetcols', methods=['POST'])
def monte_get_cols():
    sheet = request.json['sheet'] # Obtém o dado passado na requisição.
    cols = monte_controller.get_cols(sheet) # Obtém as colunas da planilha.
    return jsonify(cols) # Retorna a resposta do servidor.

@app.route('/montegetsubprocesses', methods=['POST'])
def monte_get_subprocesses():
    subprocesses_col = request.json['subprocessesCol'] # Obtém o dado passado na requisição.
    subprocesses = monte_controller.get_subprocesses(subprocesses_col) # Obtém os subprocessos da coluna.
    return jsonify(subprocesses) # Retorna a resposta do servidor.

@app.route('/montegetsubgroups', methods=['POST'])
def monte_get_subgroups():
    subgroups_col = request.json['subgroupsCol'] # Obtém o dado passado na requisição.
    subprocesses = request.json['subprocesses'] # Obtém o dado passado na requisição.
    subgroups_per_subprocesses = monte_controller.get_subgroups(subgroups_col, subprocesses) # Obtém os subgrupos da coluna.
    return jsonify(subgroups_per_subprocesses) # Retorna a resposta do servidor.

@app.route('/montesubmitform', methods=['POST'])
def monte_submit_form():
    form_data = request.json # Obtém o dado passado na requisição.
    data = monte_controller.generate_monte_carlo(form_data) # Gera a simulação de Monte Carlo.
    return jsonify(data) # Retorna a resposta do servidor.

# ---------------------------------------------------------------------------- #

@app.route('/twovariancegetsheets', methods=['POST'])
def twovariance_get_sheets():
    file_path = request.json['filePath'] # Obtém o dado passado na requisição.
    sheets = twovariance_controller.get_sheets(file_path) # Obtém as planilhas do arquivo.
    return jsonify(sheets) # Retorna a resposta do servidor.

@app.route('/twovariancegetcols', methods=['POST'])
def twovariance_get_cols():
    sheet = request.json['sheet'] # Obtém o dado passado na requisição.
    cols = twovariance_controller.get_cols(sheet) # Obtém as colunas da planilha.
    return jsonify(cols) # Retorna a resposta do servidor.

@app.route('/twovariancegetsubprocesses', methods=['POST'])
def twovariance_get_subprocesses():
    subprocesses_col = request.json['subprocessesCol'] # Obtém o dado passado na requisição.
    subprocesses = twovariance_controller.get_subprocesses(subprocesses_col) # Obtém os subprocessos da coluna.
    return jsonify(subprocesses) # Retorna a resposta do servidor.

@app.route('/twovariancegetsubgroups', methods=['POST'])
def twovariance_get_subgroups():
    subgroups_col = request.json['subgroupsCol'] # Obtém o dado passado na requisição.
    subprocess = request.json['subprocess'] # Obtém o dado passado na requisição.
    subgroups = twovariance_controller.get_subgroups(subgroups_col, subprocess) # Obtém os subgrupos da coluna.
    return jsonify(subgroups) # Retorna a resposta do servidor.

@app.route('/twovariancesubmitform', methods=['POST'])
def twovariance_submit_form():
    form_data = request.json # Obtém o dado passado na requisição.
    twovariance_controller.generate_twovariance(form_data) # Gera o teste de 2 variâncias.
    return jsonify("OK")

# ---------------------------------------------------------------------------- #

if __name__ == "__main__":
    app.run(debug=True)
