# Análisis de Fase y Estabilidad en Sistemas con Retardo

Este proyecto presenta un análisis detallado del comportamiento de la fase en sistemas con retardo, enfocándose en la estabilidad y la frecuencia crítica. El trabajo incluye visualizaciones interactivas y demostraciones matemáticas para entender cómo el retardo afecta la estabilidad del sistema.

## Características Principales

- **Análisis de Fase**: Estudio del comportamiento de la fase en función de la frecuencia y el retardo.
- **Frecuencia Crítica**: Identificación de la frecuencia crítica (\(\omega_s\)) donde la fase cruza \(-\pi\).
- **Retardo Máximo**: Cálculo del retardo máximo (\(\tau_{\text{max}}\)) que el sistema puede tolerar antes de volverse inestable.
- **Visualizaciones Interactivas**: Gráficos que muestran la relación entre la fase, el retardo y la derivada de la fase respecto al retardo.

## Resultados Clave

1. **Frecuencia Crítica**:  
   \(\omega_s = \sqrt{ab} = 0.3162 \text{ rad/s}\) (para \(a = 0.2\), \(b = 0.5\)).

2. **Retardo Máximo**:  
   \(\tau_{\text{max}} = 1.6148 \text{ s}\).

3. **Comportamiento de la Fase**:  
   - Para \(\tau < \tau_{\text{max}}\), la fase \(\Phi(\omega_s) > -\pi\) (zona estable).  
   - Para \(\tau \geq \tau_{\text{max}}\), la fase \(\Phi(\omega_s) \leq -\pi\) (zona inestable).

## Visualizaciones

### Gráfico de Fase vs. Retardo
![Fase vs. Retardo](images/phase_vs_tau.png)

### Gráfico de la Derivada de la Fase
![Derivada de la Fase](images/derivative_phase.png)

## Cómo Usar el Proyecto

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/analisis-fase-retardo.git
   cd analisis-fase-retardo