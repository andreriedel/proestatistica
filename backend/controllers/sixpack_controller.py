import pandas as pd
from models.sixpack_model import sixpack_model
from views.sixpack_view import sixpack_view

class sixpack_controller:
    def __init__(self):
        self.model = sixpack_model()
        self.view = sixpack_view()

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

    # Obtém os subgrupos de uma determinado coluna relacionados ao subprocesso escolhido.
    def get_subgroups(self, subgroups_col, subprocess):
        self.model.set_subgroups_col(subgroups_col)

        df = self.model.get_df() # Recupera o dataframe.
        subprocesses_col = self.model.get_subprocesses_col() # Recupera a coluna de subprocessos.

        subgroups = df[df[subprocesses_col] == subprocess][subgroups_col].unique().tolist()
        
        return subgroups

    # ------------------------------------------------------------------------ #

    def generate_capability_sixpack(self, form_data):
        file_path = form_data['filePath']
        sheet = form_data['sheet']
        subprocesses_col = form_data['subprocessesCol']
        subprocess = form_data['subprocess']
        subgroups_col = form_data['subgroupsCol']
        subgroup = form_data['subgroup']
        values_col = form_data['valuesCol']
        lie = form_data['lie']
        lse = form_data['lse']

        self.model.set_file_path(file_path)        
        self.model.set_sheet(sheet)
        self.model.set_subprocesses_col(subprocesses_col)
        self.model.set_subgroups_col(subgroups_col)
        self.model.set_values_col(values_col)

        self.model.create_df()
        df = self.model.get_df()
        
        # obtém os dados do subgrupo
        data = df[df[subgroups_col] == subgroup][values_col]

        # REVIEW: atualiza os gráficos do subgrupo com exibição
        self.view.update_subgroup_charts(sg=subgroup, dt=data, lie=lie, lse=lse)
