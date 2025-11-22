/**
 * HydroCalc Pro - Rainwater Harvesting Sizing Logic
 * 
 * This script handles the user interaction, calculation logic based on the
 * adapted German Method (0.06 coefficient), and PDF report generation.
 */

/**
 * Rainfall Data (Average Annual Precipitation in mm)
 * Source: INMET normals (approximate for MVP)
 * @type {Object.<string, {name: string, annual: number}>}
 */
const rainfallData = {
    "SP": { name: "São Paulo (SP)", annual: 1600 },
    "RJ": { name: "Rio de Janeiro (RJ)", annual: 1200 },
    "BH": { name: "Belo Horizonte (MG)", annual: 1500 },
    "Curitiba": { name: "Curitiba (PR)", annual: 1500 },
    "Brasília": { name: "Brasília (DF)", annual: 1500 }
};

// DOM Elements
const citySelect = document.getElementById('citySelect');
const rainfallInfo = document.getElementById('rainfallInfo');
const calcForm = document.getElementById('calcForm');
const resultsCard = document.getElementById('resultsCard');
const btnDownload = document.getElementById('btnDownload');

/**
 * Initializes the application.
 * Populates the city dropdown and sets up event listeners.
 */
function init() {
    // Populate City Select
    for (const [key, data] of Object.entries(rainfallData)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.name;
        citySelect.appendChild(option);
    }

    // Event Listeners
    citySelect.addEventListener('change', updateRainfallInfo);
    calcForm.addEventListener('submit', handleCalculation);
}

/**
 * Updates the rainfall info text based on the selected city.
 * @param {Event} e - The change event.
 */
function updateRainfallInfo(e) {
    const city = rainfallData[e.target.value];
    if (city) {
        rainfallInfo.textContent = `Média Pluviométrica Anual: ${city.annual} mm`;
        rainfallInfo.classList.remove('hidden');
    } else {
        rainfallInfo.classList.add('hidden');
    }
}

/**
 * Handles the calculation form submission.
 * @param {Event} e - The submit event.
 */
function handleCalculation(e) {
    e.preventDefault();

    const cityKey = citySelect.value;
    const area = parseFloat(document.getElementById('areaInput').value);
    const dailyDemand = parseFloat(document.getElementById('demandInput').value);

    if (!cityKey || isNaN(area) || isNaN(dailyDemand) || area <= 0 || dailyDemand <= 0) {
        alert("Por favor, preencha todos os campos com valores válidos.");
        return;
    }

    const results = calculateDimensioning(cityKey, area, dailyDemand);
    updateUI(results);
}

/**
 * Calculates the rainwater harvesting system parameters.
 * 
 * Logic based on an adapted German Method:
 * Volume = 0.06 * Min(AnnualCapture, AnnualDemand)
 * 
 * @param {string} cityKey - The key of the selected city.
 * @param {number} area - Catchment area in m².
 * @param {number} dailyDemand - Daily non-potable water demand in Liters.
 * @returns {Object} The calculation results.
 */
function calculateDimensioning(cityKey, area, dailyDemand) {
    const city = rainfallData[cityKey];
    const annualRainfall = city.annual; // mm
    
    // 1. Annual Capture Potential (Liters)
    // Assuming 100% efficiency for potential calculation base, though usually runoff is 0.8-0.9.
    // Keeping it simple as per "Practical Method" requests often imply.
    const annualCaptureRaw = annualRainfall * area; 
    const monthlyCaptureAvg = annualCaptureRaw / 12;

    // 2. Annual Demand (Liters)
    const annualDemand = dailyDemand * 365;
    const monthlyDemand = annualDemand / 12;

    // 3. Tank Volume Calculation
    // Formula: V = 0.06 * Min(AnnualCapture, AnnualDemand)
    const limitingFactor = Math.min(annualCaptureRaw, annualDemand);
    const tankVolume = 0.06 * limitingFactor;

    // 4. Savings Calculation
    // Monthly Savings = Min(MonthlyCapture, MonthlyDemand) * Price
    // Price = R$ 8.00 / m³ = R$ 0.008 / L
    const monthlyVolumeUsed = Math.min(monthlyCaptureAvg, monthlyDemand);
    const monthlySavings = monthlyVolumeUsed * 0.008;

    // 5. Autonomy
    const autonomy = tankVolume / dailyDemand;

    return {
        tankVolume,
        monthlySavings,
        monthlyCaptureAvg,
        monthlyDemand,
        autonomy
    };
}

/**
 * Updates the UI with the calculation results.
 * @param {Object} results - The calculation results.
 */
function updateUI(results) {
    document.getElementById('tankVolume').textContent = `${Math.ceil(results.tankVolume).toLocaleString('pt-BR')} L`;
    document.getElementById('savings').textContent = `R$ ${results.monthlySavings.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('monthlyCapture').textContent = `${Math.round(results.monthlyCaptureAvg).toLocaleString('pt-BR')} L/mês`;
    document.getElementById('monthlyDemand').textContent = `${Math.round(results.monthlyDemand).toLocaleString('pt-BR')} L/mês`;
    document.getElementById('autonomyDays').textContent = `${Math.round(results.autonomy)} dias`;

    // Show Results
    resultsCard.classList.remove('opacity-50', 'pointer-events-none');
    resultsCard.classList.add('opacity-100', 'fade-in');
    btnDownload.disabled = false;
    btnDownload.classList.remove('opacity-50', 'cursor-not-allowed');
}

/**
 * Generates a PDF report using jsPDF.
 */
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const cityKey = citySelect.value;
    const city = rainfallData[cityKey];
    const area = document.getElementById('areaInput').value;
    const demand = document.getElementById('demandInput').value;
    const volume = document.getElementById('tankVolume').textContent;
    const savings = document.getElementById('savings').textContent;
    const capture = document.getElementById('monthlyCapture').textContent;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(2, 132, 199); // Sky-600
    doc.text("Relatório Técnico de Dimensionamento", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Sistema de Aproveitamento de Água de Chuva", 20, 30);
    doc.line(20, 35, 190, 35);

    // Project Data
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. Parâmetros do Projeto", 20, 50);
    
    doc.setFontSize(11);
    doc.text(`Localização: ${city.name}`, 25, 60);
    doc.text(`Área de Captação: ${area} m²`, 25, 68);
    doc.text(`Demanda Diária: ${demand} Litros`, 25, 76);
    doc.text(`Precipitação Média Anual: ${city.annual} mm`, 25, 84);

    // Results
    doc.setFontSize(14);
    doc.text("2. Resultados do Dimensionamento", 20, 100);
    
    doc.setFillColor(240, 249, 255); // Sky-50
    doc.rect(20, 105, 170, 40, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text(`Volume do Tanque Recomendado: ${volume}`, 30, 120);
    
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text(`Economia Estimada Mensal: ${savings}`, 30, 135);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Potencial de Captação: ${capture}`, 30, 150);

    // Recommendation Text
    doc.setFontSize(14);
    doc.text("3. Recomendação Técnica", 20, 170);
    
    doc.setFontSize(10);
    const text = "Recomenda-se a instalação de um sistema de pré-filtragem para remoção de detritos sólidos (folhas, galhos) antes do armazenamento. O reservatório deve ser protegido contra a entrada de luz solar para evitar a proliferação de algas e mantido fechado para impedir o acesso de vetores. A água armazenada destina-se EXCLUSIVAMENTE para fins não potáveis (irrigação, lavagem de pisos, descarga sanitária).";
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 180);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()} via HydroCalc Pro`, 20, 280);

    doc.save("Relatorio_Dimensionamento_Agua_Chuva.pdf");
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
