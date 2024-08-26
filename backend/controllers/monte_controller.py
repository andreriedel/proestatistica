import pandas as pd
import json
from models.monte_model import monte_model
from views.monte_view import monte_view

class monte_controller:
    def __init__(self):
        self.model = monte_model()
        self.view = monte_view()

    # ------------------------------------------------------------------------ #

    # Obtém as planilhas de um determinado arquivo.
    def get_sheets(self, file_path):
        self.model.set_file_path(file_path)
        excel_file = pd.ExcelFile(file_path)
        return excel_file.sheet_names
    
    # Obtém as colunas de uma determinado planilha.
    def get_cols(self, sheet):
        self.model.set_sheet(sheet)
        self.model.create_df()
        return self.model.get_df().columns.tolist()
    
    # Obtém os subprocessos de uma determinada coluna.
    def get_subprocesses(self, subprocesses_col):
        self.model.set_subprocesses_col(subprocesses_col)
        return self.model.get_df()[subprocesses_col].unique().tolist()
    
    # Obtém os subgrupos de uma determinado coluna relacionados aos subprocessos escolhidos.
    def get_subgroups(self, subgroups_col, subprocesses):
        self.model.set_subgroups_col(subgroups_col)

        df = self.model.get_df() # Recupera o dataframe.
        subprocesses_col = self.model.get_subprocesses_col() # Recupera a coluna de subprocessos.

        # Array de subgrupos por subprocesso.
        subgroups_per_subprocesses = []

        # Percorre todos os subprocessos (escolhidos pelo usuário).
        for subprocess in subprocesses:
            subgroups = df[df[subprocesses_col] == subprocess][subgroups_col].unique().tolist()
            subgroups_per_subprocesses.append({'subgroups': subgroups, 'subprocess': subprocess})
        
        return subgroups_per_subprocesses

    # ------------------------------------------------------------------------ #

    def generate_monte_carlo(self, form_data):
        file_path = form_data['filePath']
        sheet = form_data['sheet']
        subprocesses_col = form_data['subprocessesCol']
        subprocesses = form_data['subprocesses']
        subgroups_col = form_data['subgroupsCol']
        subgroups = form_data['subgroups']
        min_col = form_data['minCol']
        mean_col = form_data['meanCol']
        max_col = form_data['maxCol']
        minmax = form_data['minmax'] # Minimizar ou maximizar.
        minmaxper = form_data['minmaxper'] # Porcentagem.
        
        self.model.set_file_path(file_path)        
        self.model.set_sheet(sheet)
        self.model.set_subprocesses_col(subprocesses_col)
        self.model.set_subgroups_col(subgroups_col)
        self.model.set_min_col(min_col)
        self.model.set_mean_col(mean_col)
        self.model.set_max_col(max_col)

        self.model.create_df()
        df = self.model.get_df()

        minmaxper = float(minmaxper) # Porcentagem a ser minimizada ou maximizada.

        self.view.delete_images('./../frontend/imgs', 'montecarlo')

        results = []
        results.append(subprocesses) # Primeiro elemento do resultado são os próprios subprocessos.
        results.append([]) # Segundo elemento do resultado são objetos contendo as simulações.

        for i, subgroup in enumerate(subgroups):
            subgroup = json.loads(subgroup)

            # Obtém os dados do subgrupo para o subprocesso.
            data = df[df[subprocesses_col] == subgroup["subprocess"]][df[subgroups_col] == subgroup["subgroup"]][[min_col, mean_col, max_col]]

            simulation = self.view.monte_carlo(data[min_col], data[mean_col], data[max_col], 10000, minmax, minmaxper, subgroup["subprocess"], subgroup["subgroup"])

            result = {
                "subprocess": subgroup["subprocess"],
                "subgroup": subgroup["subgroup"],
                "simulation": round(float(simulation), 2)
            }

            results[1].insert(i, result)

        return results
