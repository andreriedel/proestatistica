import pandas as pd
from models.regression_model import regression_model
from views.regression_view import regression_view

class regression_controller:
    def __init__(self):
        self.model = regression_model()
        self.view = regression_view()

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

    # ------------------------------------------------------------------------ #

    def generate_regression_analysis(self, form_data):
        file_path = form_data['filePath']
        sheet = form_data['sheet']
        x_col = form_data['xCol']
        y_col = form_data['yCol']

        self.model.set_file_path(file_path)        
        self.model.set_sheet(sheet)
        self.model.set_x_col(x_col)
        self.model.set_y_col(y_col)

        self.model.create_df()
        df = self.model.get_df()

        self.view.regression_analysis(df, x_col, y_col)
