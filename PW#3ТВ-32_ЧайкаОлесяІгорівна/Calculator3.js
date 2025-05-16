const abc_q = 5, day = 24;
let shareNoImbalances; // Ця глобальна змінна модифікується функцією integrate()

function integrate(numPoints, p, q) {
    if (q === 0) {
        shareNoImbalances = 1;
        return (100).toFixed(2);
    }
    let start = p - (p * abc_q / 100);
    let end = p + (p * abc_q / 100);
    let step = (end - start) / numPoints;
    let area = 0;
    
    // Обробка випадків, коли крок інтегрування нульовий
    if (step === 0 && p > 0) { 
         // Діапазон інтегрування нульовий через мале 'p' або налаштування 'abc_q'.
         // Припускаємо, що 100% знаходиться в межах визначених +/- 5% меж.
         shareNoImbalances = 1.0;
         return (100.0).toFixed(2);
    }
    if (step === 0 && p === 0) { 
        shareNoImbalances = 0;
        return (0).toFixed(2);
    }

    for (let x = start; x < end; x += step) {
        let y1 = gaussian(x, p, q);
        let y2 = gaussian(x + step, p, q);
        let trapArea = (step / 2) * (y1 + y2);
        area += trapArea;
    }
    shareNoImbalances = area;
    return (area * 100).toFixed(2);
}

function gaussian(x, p, q) {
    if (q === 0) {
        // Обробка випадку q=0 (Дельта-функція Дірака).
        // Функція integrate() має першочергову логіку для цього.
        return (x === p) ? Infinity : 0; // Спрощена поведінка; integrate() обробляє q=0 окремо.
    }
    let sqrtTwoPi = Math.sqrt(2 * Math.PI);
    let exponent = -Math.pow(x - p, 2) / (2 * Math.pow(q, 2));
    let temp = (1 / (q * sqrtTwoPi)) * Math.exp(exponent);
    return temp;
}

function calculElect(p) {
    let mwH = shareNoImbalances * day * p;
    return mwH;
}

function calculMinusElect(p) {
    let mwH = (1 - shareNoImbalances) * day * p;
    return mwH;
}

const inputAveragePower = document.getElementById('averagePower');
const inputCurrentDeviation = document.getElementById('currentDeviation');
const inputPredictedDeviation = document.getElementById('predictedDeviation');
const inputPricePerKwh = document.getElementById('pricePerKwh');
const btnCalculate = document.getElementById('calculateButton');

const outputCurrentShare = document.getElementById('currentShare');
const outputCurrentProfitableEnergy = document.getElementById('currentProfitableEnergy');
const outputCurrentPenaltyEnergy = document.getElementById('currentPenaltyEnergy');
const outputCurrentProfit = document.getElementById('currentProfit');

const outputPredictedShare = document.getElementById('predictedShare');
const outputPredictedProfitableEnergy = document.getElementById('predictedProfitableEnergy');
const outputPredictedPenaltyEnergy = document.getElementById('predictedPenaltyEnergy');
const outputPredictedProfit = document.getElementById('predictedProfit');

btnCalculate.addEventListener('click', function () {
    clearResults();

    const avgPower = Number(inputAveragePower.value);
    const currentDev = Number(inputCurrentDeviation.value);
    const predictedDev = Number(inputPredictedDeviation.value);
    const price = Number(inputPricePerKwh.value);

    if (isNaN(avgPower) || isNaN(currentDev) || isNaN(predictedDev) || isNaN(price) ||
        avgPower < 0 || currentDev < 0 || predictedDev < 0 || price < 0) {
        alert("Будь ласка, введіть дійсні позитивні числові значення в усі поля.");
        return;
    }
    // Якщо avgPower = 0, розрахунки природно дадуть 0 для енергії/прибутку,
    // навіть якщо відхилення > 0. Gaussian з p=0, q>0 є визначеним.
    
    // Розрахунки для поточного відхилення
    const wq = integrate(200, avgPower, currentDev); // integrate модифікує глобальну shareNoImbalances
    const prElec = calculElect(avgPower);
    const fElec = calculMinusElect(avgPower);
    const received = prElec * price * 1000; // Переведення грн/кВт*год в грн/МВт*год
    const paid = fElec * price * 1000;

    outputCurrentShare.textContent = wq + " %";
    outputCurrentProfitableEnergy.textContent = prElec.toFixed(1) + " МВт*год";
    outputCurrentPenaltyEnergy.textContent = fElec.toFixed(1) + " МВт*год";
    outputCurrentProfit.textContent = "Отримано: " + received.toFixed(2) + " грн - Заплачено: " + paid.toFixed(2)
        + " грн = Чистий заробіток: " + (received - paid).toFixed(2) + " грн";

    // Розрахунки для прогнозованого відхилення
    const predwq = integrate(200, avgPower, predictedDev); // integrate модифікує глобальну shareNoImbalances
    const predprElec = calculElect(avgPower);
    const predfElec = calculMinusElect(avgPower);
    const predreceived = predprElec * price * 1000;
    const predpaid = predfElec * price * 1000;
    
    outputPredictedShare.textContent = predwq + " %";
    outputPredictedProfitableEnergy.textContent = predprElec.toFixed(1) + " МВт*год";
    outputPredictedPenaltyEnergy.textContent = predfElec.toFixed(1) + " МВт*год";
    outputPredictedProfit.textContent = "Отримано: " + predreceived.toFixed(2) + " грн - Заплачено: " + predpaid.toFixed(2)
        + " грн = Чистий заробіток: " + (predreceived - predpaid).toFixed(2) + " грн";
});

function clearResults() {
    outputCurrentShare.textContent = "";
    outputCurrentProfitableEnergy.textContent = "";
    outputCurrentPenaltyEnergy.textContent = "";
    outputCurrentProfit.textContent = "";
    outputPredictedShare.textContent = "";
    outputPredictedProfitableEnergy.textContent = "";
    outputPredictedPenaltyEnergy.textContent = "";
    outputPredictedProfit.textContent = "";
}

document.addEventListener('DOMContentLoaded', () => {
    clearResults(); 
});