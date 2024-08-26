import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import re
import os

class monte_view:
    def monte_carlo(self, minimum, mode, maximum, num_simulations, minmax, minmaxper, subprocess, subgroup):
        simulations = np.random.triangular(minimum, mode, maximum, num_simulations)

        # Plota o histograma.
        plt.figure(figsize=(10, 6))

        # Valor de retorno da simulação.
        monte_carlo_simulation = 0

        if (minmax == "min"):
            # Calcula o percentil correspondente ao percentual a ser minimizado.
            minimize_percentile = np.percentile(simulations, minmaxper)

            # Separa os valores.
            lower_values = simulations[simulations <= minimize_percentile]
            upper_values = simulations[simulations > minimize_percentile]

            # Plota toda a distribuição em azul.
            count, bins, patches = plt.hist(simulations, bins=30, alpha=0.7, color='blue', edgecolor='black')
            
            # Destaca os valores minimizados em vermelho.
            for i in range(len(patches)):
                if bins[i] <= minimize_percentile:
                    patches[i].set_facecolor('red')

            plt.axvline(x=np.min(lower_values), color='black', linestyle='dashed', label=f'Valor mínimo da distribuição: {np.min(lower_values):.2f}')
            plt.axvline(x=np.min(upper_values), color='black', linestyle='dashed', label=f'Valor minimizado: {np.min(upper_values):.2f}')
            plt.axvline(x=np.max(upper_values), color='black', linestyle='dashed', label=f'Valor máximo da distribuição: {np.max(upper_values):.2f}')

            monte_carlo_simulation = np.min(upper_values)

        if (minmax == "max"):
            # Calcula o percentil correspondente ao percentual a ser maximizado.
            maximize_percentile = np.percentile(simulations, minmaxper)
            
            # Separa os valores.
            lower_values = simulations[simulations < maximize_percentile]
            upper_values = simulations[simulations >= maximize_percentile]

            # Plota toda a distribuição em azul.
            count, bins, patches = plt.hist(simulations, bins=30, alpha=0.7, color='blue', edgecolor='black')
            
            # Destaca os valores maximizados em vermelho.
            for i in range(len(patches)):
                if bins[i] >= maximize_percentile:
                    patches[i].set_facecolor('red')

            plt.axvline(x=np.min(lower_values), color='black', linestyle='dashed', label=f'Valor mínimo da distribuição: {np.min(lower_values):.2f}')
            plt.axvline(x=np.min(upper_values), color='black', linestyle='dashed', label=f'Valor maximizado: {np.max(lower_values):.2f}')
            plt.axvline(x=np.max(upper_values), color='black', linestyle='dashed', label=f'Valor máximo da distribuição: {np.max(upper_values):.2f}')

            monte_carlo_simulation = np.max(lower_values)
        
        # Configurações do gráfico.
        plt.title(f'Distribuição Triangular - {subgroup}')
        plt.xlabel('Valor')
        plt.ylabel('Frequência')
        plt.legend()

        pattern = r'[ \-\/]'
        subprocess_formatted = re.sub(pattern, '', subprocess)
        subgroup_formatted = re.sub(pattern, '', subgroup)
        
        file_name = f'./../frontend/imgs/montecarlo-{subprocess_formatted}-{subgroup_formatted}.png'
        plt.savefig(file_name, bbox_inches='tight')

        # Fecha o gráfico.
        plt.close()

        return monte_carlo_simulation
    
    def delete_images(self, directory, prefix):
        # Verifica se o diretório especificado existe
        if not os.path.exists(directory):
            print(f"O diretório {directory} não existe.")
            return
        
        # Lista todos os arquivos no diretório
        files = os.listdir(directory)
        
        # Filtra e deleta os arquivos que começam com o prefixo especificado
        for file in files:
            if file.startswith(prefix) and file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                file_path = os.path.join(directory, file)
                os.remove(file_path)
                print(f"Deletado: {file_path}")
            else:
                print(f"Arquivo não corresponde ao padrão: {file}")
