const COEFFICIENT_G_TO_TON = 1e-6;
const PERCENTAGE_DIVISOR = 100;

function updateElementText(elementId, value, decimalPlaces = 2) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = Number.isFinite(value) ? value.toFixed(decimalPlaces) : 'Помилка';
    } else {
        console.warn(`Елемент з ID "${elementId}" не знайдено.`);
    }
}

/**
 * Розраховує скориговану нижчу робочу теплоту згоряння мазуту.
 * @param {number} initialHeatValue - Початкова теплота згоряння мазуту (МДж/кг).
 * @param {number} waterContent - Вміст води в мазуті (%).
 * @param {number} ashContent - Вміст золи в мазуті (%).
 * @returns {number} Скоригована теплота згоряння мазуту (МДж/кг).
 */
function calculateCorrectedHeatValueOilFuel(initialHeatValue, waterContent, ashContent) {
    return initialHeatValue * (PERCENTAGE_DIVISOR - waterContent - ashContent) / PERCENTAGE_DIVISOR - 0.025 * waterContent;
}

/**
 * Розраховує показник емісії для вугілля.
 * @param {number} heatValueCoal - Нижча робоча теплота згоряння вугілля (МДж/кг).
 * @param {number} ashCaptureEfficiencyCoal - Ефективність уловлювання золи для вугілля.
 * @param {number} ashContentCoal - Вміст золи у вугіллі (%).
 * @param {number} combustibleLossCoal - Втрати від механічного недопалу вугілля (%).
 * @param {number} ashCollectorEfficiency - Ефективність золоочисних пристроїв.
 * @param {number} additionalFactor - Додатковий коефіцієнт.
 * @returns {number} Показник емісії для вугілля (г/ГДж).
 */
function calculateCoalEmissionIndex(heatValueCoal, ashCaptureEfficiencyCoal, ashContentCoal, combustibleLossCoal, ashCollectorEfficiency, additionalFactor) {
    return (Math.pow(10, 6) / heatValueCoal) * ashCaptureEfficiencyCoal * (ashContentCoal / (PERCENTAGE_DIVISOR - combustibleLossCoal)) * (1 - ashCollectorEfficiency) + additionalFactor;
}

/**
 * Розраховує показник емісії для мазуту.
 * @param {number} correctedHeatValueOilFuel - Скоригована теплота згоряння мазуту (МДж/кг).
 * @param {number} ashCaptureEfficiencyOilFuel - Ефективність уловлювання золи для мазуту.
 * @param {number} ashContentOilFuel - Вміст золи в мазуті (%).
 * @param {number} combustibleLossOilFuel - Втрати від механічного недопалу мазуту (%).
 * @param {number} ashCollectorEfficiency - Ефективність золоочисних пристроїв.
 * @param {number} additionalFactor - Додатковий коефіцієнт.
 * @returns {number} Показник емісії для мазуту (г/ГДж).
 */
function calculateOilFuelEmissionIndex(correctedHeatValueOilFuel, ashCaptureEfficiencyOilFuel, ashContentOilFuel, combustibleLossOilFuel, ashCollectorEfficiency, additionalFactor) {
    return (Math.pow(10, 6) / correctedHeatValueOilFuel) * ashCaptureEfficiencyOilFuel * (ashContentOilFuel / (PERCENTAGE_DIVISOR - combustibleLossOilFuel)) * (1 - ashCollectorEfficiency) + additionalFactor;
}

function performCalculation() {
    const inputIds = ['coal', 'oilFuel', 'gas'];
    const inputValues = {};
    let hasError = false;

    for (const id of inputIds) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Елемент з ID "${id}" не знайдено!`);
            alert(`Помилка: не знайдено поле вводу для "${id}".`);
            hasError = true;
            break;
        }
        const value = parseFloat(element.value.replace(',', '.'));
        if (isNaN(value) || value < 0) {
            alert(`Будь ласка, введіть коректне числове значення для "${element.previousElementSibling.textContent || id}".`);
            element.focus();
            hasError = true;
            break;
        }
        inputValues[id] = value;
    }

    if (hasError) {
        updateElementText("coalEmissionIndex", NaN);
        updateElementText("coalEmissions", NaN);
        updateElementText("oilFuelEmissionIndex", NaN);
        updateElementText("oilFuelEmissions", NaN);
        updateElementText("gasEmissionIndex", NaN);
        updateElementText("gasEmission", NaN);
        return;
    }

    const coalAmount = inputValues.coal;
    const oilFuelAmount = inputValues.oilFuel;
    // const gasAmount = inputValues.gas;

    const heatValueCoal_MJ_per_kg = 20.47;
    const ashContentCoal_percent = 25.20;
    const ashContentOilFuel_percent = 0.15;
    const combustibleLossCoal_percent = 1.5;
    const combustibleLossOilFuel_percent = 0;
    const waterContentOilFuel_percent = 2;
    const initialHeatValueOilFuel_MJ_per_kg = 40.40;
    const ashCollectorEfficiency = 0.985;
    const additionalFactor = 0;
    const ashCaptureEfficiencyCoal = 0.8;
    const ashCaptureEfficiencyOilFuel = 1;

    let gasEmissionIndexValue = 0;
    let gasEmissionsValue_tons = 0;

    const correctedHeatValueOilFuel = calculateCorrectedHeatValueOilFuel(
        initialHeatValueOilFuel_MJ_per_kg,
        waterContentOilFuel_percent,
        ashContentOilFuel_percent
    );

    const coalEmissionIndexValue = calculateCoalEmissionIndex(
        heatValueCoal_MJ_per_kg,
        ashCaptureEfficiencyCoal,
        ashContentCoal_percent,
        combustibleLossCoal_percent,
        ashCollectorEfficiency,
        additionalFactor
    );

    const oilFuelEmissionIndexValue = calculateOilFuelEmissionIndex(
        correctedHeatValueOilFuel,
        ashCaptureEfficiencyOilFuel,
        ashContentOilFuel_percent,
        combustibleLossOilFuel_percent,
        ashCollectorEfficiency,
        additionalFactor
    );

    const coalEmissions_tons = COEFFICIENT_G_TO_TON * coalEmissionIndexValue * heatValueCoal_MJ_per_kg * coalAmount;
    const oilFuelEmissions_tons = COEFFICIENT_G_TO_TON * oilFuelEmissionIndexValue * initialHeatValueOilFuel_MJ_per_kg * oilFuelAmount;

    updateElementText("coalEmissionIndex", coalEmissionIndexValue);
    updateElementText("coalEmissions", coalEmissions_tons);

    updateElementText("oilFuelEmissionIndex", oilFuelEmissionIndexValue);
    updateElementText("oilFuelEmissions", oilFuelEmissions_tons);

    updateElementText("gasEmissionIndex", gasEmissionIndexValue);
    updateElementText("gasEmission", gasEmissionsValue_tons);
}

document.addEventListener('DOMContentLoaded', () => {
   const calcButton = document.querySelector('button[type="button"]');
   if (calcButton) {
     calcButton.addEventListener('click', performCalculation);
   }
 });