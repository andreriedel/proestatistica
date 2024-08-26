import matplotlib.pyplot as plt
from scipy import stats

class anova_view:
    def anova(self, df, sgs_col, val_col, sgs):
        # filtra o dataframe com base nos subgrupos fornecidos
        sgs_df = df[df[sgs_col].isin(sgs)]
    
        # realiza a ANOVA para os subgrupos selecionados
        fvalue, pvalue = stats.f_oneway(*[sgs_df[sgs_df[sgs_col] == sg][val_col] for sg in sgs])

        # define o tamanho do gráfico
        plt.figure(figsize=(12, 6))

        # plota os boxplots
        data_to_plot = [sgs_df[sgs_df[sgs_col] == sg][val_col] for sg in sgs]
        plt.boxplot(data_to_plot, labels=sgs)
        
        # insere os rótulos e legendas
        plt.xticks(rotation=45)
        plt.title(f'F-value = {fvalue:.3f}; P-value = {pvalue:.3f}')
        plt.ylabel('Valores')
        plt.xlabel('')

        # calcula as medianas dos subgrupos
        medianas = [df[df[sgs_col] == sg][val_col].mean() for sg in sgs]
        
        # plota as medianas
        plt.plot(range(1, len(sgs) + 1), medianas, color='blue', marker='o')

        plt.tight_layout() # ajusta os elementos do gráfico
        
        file_name = './../frontend/imgs/anova-img.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()
