import numpy as np
from scipy.stats import norm

def doane_rule(data):
    n = len(data)
    g1 = data.skew()  # coeficiente de assimetria
    k = 1 + np.log2(n) + np.log2(1 + abs(g1)) # fórmula de Doane

    return int(np.ceil(k))

def standard_deviation_within(data):
    # calcula as amplitudes móveis (diferença absoluta entre pontos consecutivos)
    mr = [abs(data[i] - data[i - 1]) for i in range(1, len(data))]    
    mr_mean = np.mean(mr) # calcula a média das amplitudes móveis
    
    return mr_mean / 1.128 # retorna o desvio padrão dos dados

# calcula o índice de performance do processo (Ppk)
def calculate_ppk(lsl, uls, mean, std):
    ppu = (uls - mean) / (3 * std)
    ppl = (mean - lsl) / (3 * std)
    # print(ppu, ppl)
    return min(ppu, ppl)

# calcula o índice de capacidade do processo (Cpk)
def calculate_cpk(lsl, uls, mean, std):
    cpu = (uls - mean) / (3 * std)
    cpl = (mean - lsl) / (3 * std)
    # print(cpu, cpl)
    return min(cpu, cpl)

# calcula as partes por milhão fora dos limites
def calculate_ppm(std, mean, lsl, uls):
    return norm.sf(uls, loc=mean, scale=std) * 1e6
