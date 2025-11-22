# HydroCalc Pro - Dimensionamento de Aproveitamento de Água de Chuva

Este projeto é uma **Single Page Application (SPA)** desenvolvida para auxiliar no dimensionamento de sistemas de aproveitamento de água de chuva (cisternas) em residências e edificações.

A ferramenta utiliza o **Método Prático (Inglês)** para calcular o volume ideal do reservatório, estimar a economia financeira e fornecer dados técnicos essenciais para o planejamento de sistemas sustentáveis.

## 🎯 Objetivo

Facilitar o cálculo de dimensionamento de cisternas, promovendo o uso racional da água e a sustentabilidade através do aproveitamento de águas pluviais para fins não potáveis (jardim, lavagem de pisos, descarga, etc.).

## ✨ Funcionalidades

-   **Cálculo de Volume do Tanque**: Dimensionamento baseado na área de captação e demanda diária.
-   **Dados Pluviométricos Integrados**: Seleção automática da precipitação média anual para 5 capitais brasileiras (São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre).
-   **Estimativa de Economia**: Cálculo aproximado da economia mensal na conta de água.
-   **Análise Técnica**: Exibição do potencial de captação mensal, demanda mensal e autonomia estimada.
-   **Relatório em PDF**: Geração automática de um relatório técnico formatado para download.
-   **Interface Responsiva**: Design moderno e adaptável para dispositivos móveis e desktops.

## 🛠️ Tecnologias Utilizadas

-   **HTML5**: Estrutura semântica da aplicação.
-   **Tailwind CSS** (via CDN): Estilização moderna e responsiva.
-   **JavaScript (Vanilla)**: Lógica de cálculo e manipulação do DOM.
-   **FontAwesome**: Ícones para interface do usuário.
-   **jsPDF**: Biblioteca para geração de relatórios em PDF diretamente no navegador.

## 📐 Metodologia de Cálculo

O sistema utiliza uma adaptação do **Método Prático (Inglês)**, amplamente utilizado para estimativas rápidas e seguras:

> **Volume = 0.06 × (Menor valor entre: Demanda Anual ou Captação Anual)**

Onde:
*   **Captação Anual** = Área de Cobertura (m²) × Precipitação Média Anual (mm) × Coeficiente de Run-off (adotado 0.85).
*   **Demanda Anual** = Demanda Diária (L) × 365 dias.

## 🚀 Como Usar

1.  **Acesse a aplicação**: Abra o arquivo `index.html` em seu navegador.
2.  **Selecione a Localização**: Escolha a cidade mais próxima para utilizar os dados pluviométricos corretos.
3.  **Informe a Área de Captação**: Insira a área do telhado ou superfície de captação em metros quadrados (m²).
4.  **Informe a Demanda Diária**: Estime o consumo diário de água não potável em litros (ex: 500L).
5.  **Calcule**: Clique no botão "Calcular Dimensionamento".
6.  **Analise os Resultados**: Veja o volume sugerido, economia e outros dados técnicos.
7.  **Baixe o Relatório**: Clique em "Baixar Relatório Técnico" para salvar os dados em PDF.

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais e de sustentabilidade.

---
**Desenvolvido por João Paviani**
