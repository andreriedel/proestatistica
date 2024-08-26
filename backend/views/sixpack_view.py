import utils.utils as ut
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from scipy.stats import norm

# TODO: arrumar parâmetro dos métodos

class sixpack_view:
    def update_subgroup_charts(self, sg, dt, lie, lse):
        self.plot_i_chart(sg, dt)
        self.plot_mr_chart(sg, dt)
        self.plot_last_observations(sg, dt)
        self.plot_capability_histogram(sg, dt, lie, lse)
        self.plot_normal_probability_chart(sg, dt)
        self.plot_capability_chart(sg, dt, lie, lse)

    # ------------------------------------------------------------------------ #

    def plot_i_chart(self, sg, dt):
        # reindexa os dados para uma sequência contínua, facilitando a plotagem no eixo x
        dt = dt.reset_index(drop=True)

        # calcula a média dos dados para a linha central no gráfico
        central_line = np.mean(dt)

        # calcula as amplitudes móveis (diferença absoluta entre pontos consecutivos)
        mr = [abs(dt[i] - dt[i - 1]) for i in range(1, len(dt))]

        # calcula a média das amplitudes móveis
        mr_mean = np.mean(mr)
        
        # calcula o desvio padrão dos dados para definir os limites de controle
        std_deviation = mr_mean / 1.128
        
        # limite superior de controle (upper control limit)
        ucl = central_line + 3 * std_deviation
        
        # limite inferior de controle (lower control limit)
        lcl = central_line - 3 * std_deviation

        # inicia a figura do gráfico com tamanho especificado
        plt.figure(figsize=(12, 6))

        # plota o gráfico
        plt.plot(range(1, len(dt) + 1), dt)

        # plota os pontos do gráfico individualmente com cor condicional
        for i, value in enumerate(dt):
            if value > ucl or value < lcl:
                c = "red"
            else:
                c = "blue"
            plt.plot(i + 1, value, marker="o", color=c, linestyle="None")

        # adiciona a linha central no gráfico com estilo tracejado na cor verde
        plt.axhline(y=central_line, color="g", linestyle="--", label=f"Linha Central: {central_line:.3f}")

        # adiciona os limites de controle com estilo tracejado na cor vermelha
        plt.axhline(y=ucl, color="r", linestyle="--", label=f"Limite Superior de Controle: {ucl:.3f}")
        plt.axhline(y=lcl, color="r", linestyle="--", label=f"Limite Inferior de Controle: {lcl:.3f}")
        
        # define o título e os rótulos dos eixos x e y
        # plt.title(f'Carta I - {sg}')
        plt.xlabel("Observação")
        plt.ylabel("Valor Individual")

        # adiciona a legenda ao gráfico
        plt.legend()

        # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
        # file_name = f'./charts/i-chart/i-chart-{sg.lower().replace(" ", "-")}.png'
        file_name = './../frontend/imgs/sixpack-img-1.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()

    # ------------------------------------------------------------------------ #

    def plot_mr_chart(self, sg, dt):
        # reindexa os dados para uma sequência contínua, facilitando a plotagem no eixo x
        dt = dt.reset_index(drop=True)

        # calcula as amplitudes móveis (diferença absoluta entre pontos consecutivos)
        mr = [abs(dt[i] - dt[i - 1]) for i in range(1, len(dt))]

        # calcula a média das amplitudes móveis
        mr_mean = np.mean(mr)

        central_line = mr_mean
        
        # calcula o desvio padrão dos dados para definir os limites de controle
        std_deviation = mr_mean / 1.128
        
        # limite superior de controle (upper control limit)
        ucl = central_line + 3 * 0.853 * std_deviation
        
        # limite inferior de controle (lower control limit)
        lcl = 0

        # inicia a figura do gráfico com tamanho especificado
        plt.figure(figsize=(12, 6))

        # plota o gráfico
        plt.plot(range(2, len(dt) + 1), mr)

        # plota os pontos do gráfico individualmente com cor condicional
        for i, value in enumerate(mr):
            if value > ucl or value < lcl:
                c = "red"
            else:
                c = "blue"
            plt.plot(i + 2, value, marker="o", color=c, linestyle="None")

        # adiciona a linha central no gráfico com estilo tracejado na cor verde
        plt.axhline(y=central_line, color="g", linestyle="--", label=f"Linha Central: {central_line:.3f}")

        # adiciona os limites de controle com estilo tracejado na cor vermelha
        plt.axhline(y=ucl, color="r", linestyle="--", label=f"Limite Superior de Controle: {ucl:.3f}")
        plt.axhline(y=lcl, color="r", linestyle="--", label=f"Limite Inferior de Controle: {lcl:.0f}")
        
        # define o título e os rótulos dos eixos x e y
        # plt.title(f'Carta MR - {sg}')
        plt.xlabel("Observação")
        plt.ylabel("Amplitude Móvel")

        # adiciona a legenda ao gráfico
        plt.legend()

        # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
        # file_name = f'./charts/mr-chart/mr-chart-{sg.lower().replace(" ", "-")}.png'
        file_name = './../frontend/imgs/sixpack-img-2.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()

    # ------------------------------------------------------------------------ #

    def plot_last_observations(self, sg, dt):
        # limita os dados para no máximo 25 pontos
        dt = dt.tail(25)

        # reindexa os dados para uma sequência contínua, facilitando a plotagem no eixo x
        dt = dt.reset_index(drop=True)

        # calcula a média dos dados para a linha central no gráfico
        central_line = np.mean(dt)

        # inicia a figura do gráfico com tamanho especificado
        plt.figure(figsize=(12, 6))

        # plota o gráfico
        plt.scatter(range(1, len(dt) + 1), dt)

        # adiciona a linha central no gráfico com estilo tracejado na cor verde
        plt.axhline(y=central_line, color="g", linestyle="--", label=f"Linha Central: {central_line:.3f}")

        # define o título e os rótulos dos eixos x e y
        # plt.title(f'Últimas {len(dt)} observações - {sg}')
        plt.xlabel("Observação")
        plt.ylabel("Valor Individual")

        # adiciona a legenda ao gráfico
        plt.legend()

        # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
        # file_name = f'./charts/last-observations/last-observations-{sg.lower().replace(" ", "-")}.png'
        file_name = './../frontend/imgs/sixpack-img-3.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()
    
    # ------------------------------------------------------------------------ #

    def plot_capability_histogram(self, sg, dt, lie, lse):
        # obtém o número de elementos por classe usando a fórmula de doane
        k = ut.doane_rule(dt)

        # determina o valor mínimo e o valor máximo dos dados
        min_val = dt.min()
        max_val = dt.max()

        # calcula a amplitude total
        range = max_val - min_val

        # calcula a largura das classes
        class_length = range / k

        # calcula os intervalos das classes
        bins = np.arange(min_val, max_val + class_length, class_length)

        # define o tamanho do gráfico
        plt.figure(figsize=(12, 6))

        # plota o histograma (sem normalizar)
        plt.hist(dt, bins=bins, edgecolor="k", alpha=0.7, color='lightblue')

        # adiciona a linha vertical representando o LSE
        if lse != 0:
            plt.axvline(x=lie, color='orange', linestyle='dashed', label=f'LIE: {lie}')
            plt.axvline(x=lse, color='red', linestyle='dashed', label=f'LSE: {lse}')

        mean = dt.mean()
        std_overall = dt.std() # desvio padrão global
        std_within = ut.standard_deviation_within(dt.to_numpy()) # desvio padrão dentro

        # plota a curva de distribuição normal global
        x = np.linspace(min_val - 3 * std_overall, max_val + 3 * std_overall, 1000)
        y = norm.pdf(x, mean, std_overall) * len(dt) * class_length
        plt.plot(x, y, 'r-', lw=2, label='Global')
        
        # plota a curva de distribuição normal dentro
        x_dentro = np.linspace(min_val - 3 * std_within, max_val + 3 * std_within, 1000)
        y_dentro = norm.pdf(x_dentro, mean, std_within) * len(dt) * class_length
        plt.plot(x_dentro, y_dentro, 'k-', lw=2, label='Dentro')
        
        # define o título
        plt.title(f'Tamanho dos bins: {class_length:.3f}')

        # adiciona a legenda ao gráfico
        plt.legend()

        # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
        # file_name = f'./charts/capability-histogram/capability-histogram-{sg.lower().replace(" ", "-")}.png'
        file_name = './../frontend/imgs/sixpack-img-4.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()

    # ------------------------------------------------------------------------ #

    # def plot_normal_probability_chart(self, sg, dt):
    #     # inicia a figura do gráfico com tamanho especificado
    #     plt.figure(figsize=(12, 6))

    #     # plota o gráfico de probabilidde normal
    #     stats.probplot(dt, plot=plt)

    #     # calcula o teste de normalidade usando o teste Anderson-Darling
    #     ad = stats.anderson(dt, dist='norm').statistic
    #     p_value = stats.shapiro(dt).pvalue # REVIEW: valor de p-value incorreto
    #     print(stats.shapiro(dt))

    #     # define o título e os rótulos dos eixos x e y
    #     # plt.suptitle(f'Gráfico normal de probabilidade - {sg}')
    #     plt.title(f'AD: {ad:.3f}; P: {p_value:.3f}')
    #     plt.xlabel("")
    #     plt.ylabel("")

    #     # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
    #     # file_name = f'./charts/normal-probability/normal-probability-{sg.lower().replace(" ", "-")}.png'
    #     file_name = './../frontend/imgs/sixpack-img-5.png'
    #     plt.savefig(file_name, bbox_inches='tight')

    #     # fecha o gráfico
    #     plt.close()


    def plot_normal_probability_chart(self, sg, dt):
        plt.figure(figsize=(12, 6))

        # Create the normal probability plot
        (osm, osr), (slope, intercept, r) = stats.probplot(dt, plot=plt)

        # Calculate the confidence bounds
        n = len(dt)
        se = np.sqrt((1 - r**2) / (n - 2))
        z = stats.norm.ppf(0.975)
        lb = slope * osm + intercept - z * se
        ub = slope * osm + intercept + z * se

        # Plot the confidence bound lines
        plt.plot(osm, lb, color='red', linestyle='--', label='95% Confidence Bound')
        plt.plot(osm, ub, color='red', linestyle='--')

        ad = stats.anderson(dt, dist='norm').statistic
        p_value = stats.shapiro(dt).pvalue

        plt.title(f'AD: {ad:.3f}; P: {p_value:.3f}')
        plt.xlabel("Theoretical Quantiles")
        plt.ylabel("Ordered Values")

        file_name = './../frontend/imgs/sixpack-img-5.png'
        plt.savefig(file_name, bbox_inches='tight')

        plt.close()

    # ------------------------------------------------------------------------ #

    def plot_capability_chart(self, sg, dt, lsl, usl):
        mean = dt.mean() # média
        std_overall = dt.std() # desvio padrão global
        std_within = ut.standard_deviation_within(dt.to_numpy()) # desvio padrão dentro

        # calcula os índices CPK e PPM dentro do subgrupo
        cpk = ut.calculate_cpk(lsl, usl, mean, std_within)
        ppm_within = ut.calculate_ppm(std_within, mean, lsl, usl)

        # calcula os índices PPK e PPM global
        ppk = ut.calculate_ppk(lsl, usl, mean, std_overall)
        ppm_overall = ut.calculate_ppm(std_overall, mean, lsl, usl)

        # cria strings de texto para exibir informações sobre os cálculos dentro do subgrupo
        str_within = '\n'.join((
            r'$\mathrm{Desvio\ Padrao_{dentro}}=%.4f$' % (std_within, ),
            r'$\mathrm{CPK}=%.2f$' % (cpk, ),
            r'$\mathrm{PPM}=%.2f$' % (ppm_within, )
        ))

        # cria strings de texto para exibir informações sobre os cálculos globais
        str_overall = '\n'.join((
            r'$\mathrm{Desvio\ Padrao_{global}}=%.4f$' % (std_overall, ),
            r'$\mathrm{PPK}=%.2f$' % (ppk, ),
            r'$\mathrm{PPM}=%.2f$' % (ppm_overall, )
        ))

        # define o tamanho do gráfico
        plt.figure(figsize=(12, 6))
        
        # adiciona uma linha vertical no meio do gráfico
        plt.axvline(x=0.5, color='grey', linestyle='-', linewidth=0.5)

        # configura a exibição dos textos no gráfico
        props = dict(boxstyle='round', facecolor='wheat', alpha=0.5)

        # adiciona o título "Dentro" no lado esquerdo
        plt.gca().text(
            0.25,  # centralizado no lado esquerdo
            0.85,  # posição vertical para o título
            'Dentro',
            transform=plt.gca().transAxes,
            fontsize=12,
            verticalalignment='center',
            horizontalalignment='center'
        )

        # centraliza o quadro "Dentro" no lado esquerdo do gráfico
        plt.gca().text(
            0.25,  # centralizado no lado esquerdo
            0.5,   # centralizado verticalmente
            str_within,
            transform=plt.gca().transAxes,
            fontsize=10,
            verticalalignment='center',  # alinhamento vertical centralizado
            horizontalalignment='center',  # alinhamento horizontal centralizado
            bbox=props
        )

        # adiciona o título "Global" no lado direito
        plt.gca().text(
            0.75,  # centralizado no lado direito
            0.85,  # posição vertical para o título
            'Global',
            transform=plt.gca().transAxes,
            fontsize=12,
            verticalalignment='center',
            horizontalalignment='center'
        )

        # centraliza o quadro "Global" no lado direito do gráfico
        plt.gca().text(
            0.75,  # centralizado no lado direito
            0.5,   # centralizado verticalmente
            str_overall,
            transform=plt.gca().transAxes,
            fontsize=10,
            verticalalignment='center',  # alinhamento vertical centralizado
            horizontalalignment='center',  # alinhamento horizontal centralizado
            bbox=props
        )

        # remove os valores dos eixos x e y
        plt.gca().set_xticks([])
        plt.gca().set_yticks([])

        # remove as bordas do gráfico
        plt.gca().spines['top'].set_visible(False)
        plt.gca().spines['right'].set_visible(False)
        plt.gca().spines['bottom'].set_visible(False)
        plt.gca().spines['left'].set_visible(False)
            
        # plt.title(f'Gráfico de capacidade - {sg}')

        # salva o gráfico com o nome do subgrupo em minúsculo com os espaços substituídos por "-"
        # file_name = f'./charts/capability-chart/capability-chart-{sg.lower().replace(" ", "-")}.png'
        file_name = './../frontend/imgs/sixpack-img-6.png'
        plt.savefig(file_name, bbox_inches='tight')

        # fecha o gráfico
        plt.close()
