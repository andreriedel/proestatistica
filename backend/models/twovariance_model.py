import pandas as pd

class twovariance_model:
    def __init__(self):
        self.file_path = None
        self.sheet = None
        self.subprocesses_col = None
        self.subgroups_col = None
        self.values_col = None
        self.df = None # dataframe

    # -------------------------------- setters ------------------------------- #

    def set_file_path(self, file_path):
        self.file_path = file_path

    def set_sheet(self, sheet):
        self.sheet = sheet

    def set_subprocesses_col(self, subprocesses_col):
        self.subprocesses_col = subprocesses_col

    def set_subgroups_col(self, subgroups_col):
        self.subgroups_col = subgroups_col

    def set_values_col(self, values_col):
        self.values_col = values_col

    def set_df(self, df):
        self.df = df
        
    # -------------------------------- getters ------------------------------- #
        
    def get_file_path(self):
        return self.file_path
    
    def get_sheet(self):
        return self.sheet
    
    def get_subprocesses_col(self):
        return self.subprocesses_col
    
    def get_subgroups_col(self):
        return self.subgroups_col

    def get_values_col(self):
        return self.values_col
    
    def get_df(self):
        return self.df
    
    # ------------------------------------------------------------------------ #

    def create_df(self):
        self.df = pd.read_excel(self.file_path, sheet_name=self.sheet) # cria o dataframe
