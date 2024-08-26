import pandas as pd

class regression_model:
    def __init__(self):
        self.file_path = None
        self.sheet = None
        self.x_col = None
        self.y_col = None
        self.df = None # dataframe

    # -------------------------------- setters ------------------------------- #

    def set_file_path(self, file_path):
        self.file_path = file_path

    def set_sheet(self, sheet):
        self.sheet = sheet

    def set_x_col(self, x_col):
        self.x_col = x_col

    def set_y_col(self, y_col):
        self.y_col = y_col

    def set_df(self, df):
        self.df = df
        
    # -------------------------------- getters ------------------------------- #
        
    def get_file_path(self):
        return self.file_path
    
    def get_sheet(self):
        return self.sheet
    
    def get_x_col(self):
        return self.x_col

    def get_y_col(self):
        return self.y_col
    
    def get_df(self):
        return self.df
    
    # ------------------------------------------------------------------------ #

    def create_df(self):
        self.df = pd.read_excel(self.file_path, sheet_name=self.sheet) # cria o dataframe
