// --- КОНСТАНТИ ---
const HOURS_IN_YEAR = 8760;

// Індекси для стовпців у TABLE_DATA для кращої читабельності
const COL_LAMBDA = 0;      // Частота відмов елемента (λi)
const COL_T_RECOVERY = 1;  // Середній час відновлення елемента (Tвi)
const COL_K_SCHEDULED_DOWNTIME_COEFF = 2; // Коефіцієнт планового простою (Кппрі)
const COL_T_SCHEDULED_DOWNTIME = 3;  // Тривалість планового простою (Тппрі)

const TABLE_DATA = [
    [0.015, 100, 1, 43],
    [0.02, 80, 1, 28],
    [0.005, 60, 0.5, 10],
    [0.05, 60, 0.5, 10],
    [0.01, 30, 0.1, 30],
    [0.02, 15, 0.33, 15],
    [0.01, 15, 0.33, 15],
    [0.03, 2, 0.167, 5],
    [0.05, 4, 0.33, 10],
    [0.1, 160, 0.5, 0],
    [0.1, 50, 0.5, 0],
    [0.07, 10, 0.167, 35],
    [0.02, 8, 0.167, 35],
    [0.02, 10, 0.167, 35],
    [0.03, 44, 1, 9],
    [0.005, 17.5, 1, 9]
];

// --- DOM ЕЛЕМЕНТИ ---
const inputSelectors = ['.t110', '.t35', '.t10k', '.t10p', '.b110', '.b10m', '.b10v', '.sh', '.av', '.ed610', '.ed038', '.pl110', '.pl35', '.pl10', '.kl10t', '.kl10c'];
const outputSelectors = ['.wOs', '.t', '.kE', '.kP', '.wDk', '.wDs'];

const inputElements = {};
inputSelectors.forEach(selector => {
    // Використовуємо частину селектора без '.' як ключ
    inputElements[selector.substring(1)] = document.querySelector(selector);
});

const outputElements = {};
outputSelectors.forEach(selector => {
    outputElements[selector.substring(1)] = document.querySelector(selector);
});

const resultButton = document.querySelector('.result');

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

/**
 * Форматує число у наукову нотацію, якщо воно менше 0.01.
 * @param {number} value - Число для форматування.
 * @returns {string} Відформатоване число або рядок у науковій нотації.
 */
function formatScientificNotation(value) {
    if (value >= 0.01 || value === 0) { // Додано перевірку на 0
        return value.toFixed(4);
    }
    let power = 0;
    // Використовуємо цикл while для більшої наочності
    let tempValue = value;
    while (tempValue * Math.pow(10, power) < 1 && power < 10) { // Обмеження power для безпеки
        power++;
    }
    return (tempValue * Math.pow(10, power)).toFixed(1) + `*10<sup>-${power}</sup>`; // Використовуємо <sup> для степеня
}

// --- ФУНКЦІЇ ОБЧИСЛЕНЬ ---

/**
 * Розраховує сумарну частоту відмов системи (ωос).
 * @param {number[]} inputValues - Масив введених значень користувачем.
 * @returns {number} Сумарна частота відмов.
 */
function calculateTotalFailureFrequency(inputValues) {
    return inputValues.reduce((sum, value, index) => {
        return sum + (value * TABLE_DATA[index][COL_LAMBDA]);
    }, 0);
}

/**
 * Розраховує середній час відновлення системи (Тв).
 * @param {number[]} inputValues - Масив введених значень користувачем.
 * @param {number} totalFailureFrequency - Сумарна частота відмов (ωос).
 * @returns {number} Середній час відновлення.
 */
function calculateAverageRecoveryTime(inputValues, totalFailureFrequency) {
    if (totalFailureFrequency === 0) {
        return 0; // Уникаємо ділення на нуль
    }
    const weightedSumRecoveryTime = inputValues.reduce((sum, value, index) => {
        return sum + (value * TABLE_DATA[index][COL_LAMBDA] * TABLE_DATA[index][COL_T_RECOVERY]);
    }, 0);
    return weightedSumRecoveryTime / totalFailureFrequency;
}

/**
 * Розраховує коефіцієнт аварійного простою (Ке).
 * @param {number} totalFailureFrequency - Сумарна частота відмов (ωос).
 * @param {number} averageRecoveryTime - Середній час відновлення (Тв).
 * @returns {number} Коефіцієнт аварійного простою.
 */
function calculateEmergencyDowntimeCoefficient(totalFailureFrequency, averageRecoveryTime) {
    return (totalFailureFrequency * averageRecoveryTime) / HOURS_IN_YEAR;
}

/**
 * Розраховує коефіцієнт планового простою (Кп).
 * @param {number[]} inputValues - Масив введених значень користувачем.
 * @returns {number} Коефіцієнт планового простою.
 */
function calculateScheduledDowntimeCoefficient(inputValues) {
    let maxScheduledDowntimeProduct = 0;
    inputValues.forEach((value, index) => {
        if (value > 0) {
            const currentProduct = TABLE_DATA[index][COL_K_SCHEDULED_DOWNTIME_COEFF] * TABLE_DATA[index][COL_T_SCHEDULED_DOWNTIME];
            if (maxScheduledDowntimeProduct < currentProduct) {
                maxScheduledDowntimeProduct = currentProduct;
            }
        }
    });
    return (1.2 * maxScheduledDowntimeProduct) / HOURS_IN_YEAR;
}

/**
 * Розраховує частоту відмов для двосистемної конфігурації (ωдк).
 * @param {number} totalFailureFrequency - Сумарна частота відмов (ωос).
 * @param {number} emergencyDowntimeCoefficient - Коефіцієнт аварійного простою (Ке).
 * @param {number} scheduledDowntimeCoefficient - Коефіцієнт планового простою (Кп).
 * @returns {number} Частота відмов для двосистемної конфігурації.
 */
function calculateTwoSystemFailureFrequency(totalFailureFrequency, emergencyDowntimeCoefficient, scheduledDowntimeCoefficient) {
    return 2 * totalFailureFrequency * (emergencyDowntimeCoefficient + scheduledDowntimeCoefficient);
}

/**
 * Розраховує частоту відмов для двосистемної конфігурації з урахуванням додаткового фактора (ωдс).
 * @param {number} twoSystemFailureFrequency - Частота відмов для двосистемної конфігурації (ωдк).
 * @returns {number} ωдс.
 */
function calculateTwoSystemPlusFailureFrequency(twoSystemFailureFrequency) {
    return twoSystemFailureFrequency + 0.02;
}

// --- ОБРОБНИК ПОДІЇ ---
if (resultButton) {
    resultButton.addEventListener('click', function () {
        const currentInputValues = inputSelectors.map(selector => {
            const key = selector.substring(1);
            return Number(inputElements[key].value) || 0; // Забезпечуємо числове значення, або 0 якщо поле пусте/не число
        });

        const wOs = calculateTotalFailureFrequency(currentInputValues);
        const t = calculateAverageRecoveryTime(currentInputValues, wOs);
        const kE = calculateEmergencyDowntimeCoefficient(wOs, t);
        const kP = calculateScheduledDowntimeCoefficient(currentInputValues);
        const wDk = calculateTwoSystemFailureFrequency(wOs, kE, kP);
        const wDs = calculateTwoSystemPlusFailureFrequency(wDk);

        outputElements['wOs'].innerHTML = wOs.toFixed(3);
        outputElements['t'].innerHTML = t.toFixed(1);
        outputElements['kE'].innerHTML = formatScientificNotation(kE);
        outputElements['kP'].innerHTML = formatScientificNotation(kP);
        outputElements['wDk'].innerHTML = formatScientificNotation(wDk);
        outputElements['wDs'].innerHTML = formatScientificNotation(wDs);
    });
} else {
    console.error("Кнопка з класом '.result' не знайдена!");
}