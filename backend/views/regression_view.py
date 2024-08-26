import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

class regression_view:
    def regression_analysis(self, df, x_col, y_col):
        # filtra o dataframe com base nas colunas fornecidas
        df = df[[x_col, y_col]]

        # cria os arrays para os eixos do gráfico
        x = np.array(df[x_col])
        y = np.array(df[y_col])

        slope, intercept, rvalue, pvalue, std_err = stats.linregress(x, y)

        def myfunc(x):
            return slope * x + intercept

        mymodel = list(map(myfunc, x))

        # inicia a figura do gráfico com tamanho especificado
        plt.figure(figsize=(12, 6))

        # plota os pontos
        plt.scatter(x, y)

        # plota a reta de regressão
        plt.plot(x, mymodel)

        if slope >= 0:
            plt.title(f'{y_col} = {intercept:.3f} + {slope:.5f} * {x_col}')
        else:
            plt.title(f'{y_col} = {intercept:.3f} - {abs(slope):.5f} * {x_col} \n P-value = {pvalue:.3f}')

        plt.xlabel(x_col)
        plt.ylabel(y_col)

        plt.tight_layout() # ajusta os elementos do gráfico

        file_name = './../frontend/imgs/regression-img.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()
