const Ct_Cu = 226; // Коефіцієнт для міді
const Ct_Al = 92;  // Коефіцієнт для алюмінію
const Unorm = 10; // кВ, номінальна напруга мережі

// Таблиця економічної густини струму Jек, А/мм2
// [матеріал_idx][спрощений_індекс_ізоляції][індекс_часу]
const table = [
    [ // Мідь
        [2.5, 2.1, 1.8], // Неізольовані
        [3.0, 2.5, 2.0], // Папір/Гума/ПВХ
        [3.5, 3.1, 2.7]  // Гума/Пластмаса
    ],
    [ // Алюміній
        [1.3, 1.1, 1.0], // Неізольовані
        [1.6, 1.4, 1.2], // Папір/Гума/ПВХ
        [1.9, 1.7, 1.6]  // Гума/Пластмаса
    ]
];

function getSimplifiedInsulationIndex(insulationValue) {
    if (insulationValue === 0) return 0;
    if (insulationValue === 2) return 1;
    if (insulationValue === 4) return 2;
    return 0;
}

function normCurrent(Pm_kVA) {
    if (Pm_kVA === null || isNaN(Pm_kVA) || Unorm === null || isNaN(Unorm) || Unorm === 0) return NaN;
    return Pm_kVA / (Math.sqrt(3) * Unorm);
}

function afterEmergCurrent(Im_A) {
    if (Im_A === null || isNaN(Im_A)) return NaN;
    return 2 * Im_A;
}

function economCrossSection(Tm_hours, materialValue, insulationValue, Im_A) {
    const Jek = getEconomicDensity(Tm_hours, materialValue, insulationValue);
    if (Im_A === null || isNaN(Im_A) || Jek === null || isNaN(Jek) || Jek === 0) return NaN;
    return Im_A / Jek;
}

function getEconomicDensity(Tm_hours, materialValue, insulationValue) {
    let timeIndex;
    if (Tm_hours <= 3000) {
        timeIndex = 0;
    } else if (Tm_hours <= 5000) {
        timeIndex = 1;
    } else {
        timeIndex = 2;
    }
    const materialIndex = Number(materialValue);
    const simplifiedInsulationIdx = getSimplifiedInsulationIndex(Number(insulationValue));

    if (table[materialIndex] &&
        table[materialIndex][simplifiedInsulationIdx] &&
        table[materialIndex][simplifiedInsulationIdx][timeIndex] !== undefined) {
        return table[materialIndex][simplifiedInsulationIdx][timeIndex];
    }
    console.error("Invalid indices for economicDensityTable: ", materialIndex, simplifiedInsulationIdx, timeIndex);
    return NaN;
}

function thermalStabilitySection(Ik_A, Tf_seconds, materialValue) {
    const Ct = (Number(materialValue) === 0) ? Ct_Cu : Ct_Al;
    if (Ik_A === null || isNaN(Ik_A) || Tf_seconds === null || isNaN(Tf_seconds) || Ct === null || isNaN(Ct) || Ct === 0) return NaN;
    if (Tf_seconds < 0) return NaN;
    const section = (Ik_A * Math.sqrt(Tf_seconds)) / Ct;
    return Math.ceil(section);
}

const inputIk = document.getElementById('shortCircuitCurrent');
const inputTf = document.getElementById('shutdownTime');
const inputPm = document.getElementById('calculatedLoad');
const inputTm = document.getElementById('installationTime');
const btnCalculate1 = document.getElementById('calculateButton1');
const outputIn = document.getElementById('normalCurrent');
const outputIae = document.getElementById('emergencyCurrent');
const outputSec = document.getElementById('economicCrossSection');
const outputS_thermal = document.getElementById('finalCrossSection');

if (btnCalculate1) {
    btnCalculate1.addEventListener('click', function() {
        const Ik_val = parseFloat(inputIk.value);
        const Tf_val = parseFloat(inputTf.value);
        const Pm_val = parseFloat(inputPm.value);
        const Tm_val = parseFloat(inputTm.value);

        let materialValue;
        document.querySelectorAll('input[name="conductor-material"]').forEach(radio => {
            if (radio.checked) materialValue = Number(radio.value);
        });

        let insulationValue;
        document.querySelectorAll('input[name="insulation-type"]').forEach(radio => {
            if (radio.checked) insulationValue = Number(radio.value);
        });

        if (isNaN(Ik_val) || isNaN(Tf_val) || isNaN(Pm_val) || isNaN(Tm_val) ||
            Ik_val < 0 || Tf_val < 0 || Pm_val < 0 || Tm_val < 0 ||
            materialValue === undefined || insulationValue === undefined) {
            alert("Будь ласка, введіть коректні дані в усі поля та виберіть опції.");
            outputIn.textContent = "Помилка";
            outputIae.textContent = "Помилка";
            outputSec.textContent = "Помилка";
            outputS_thermal.textContent = "Помилка";
            return;
        }
        
        const singleLineLoad_kVA = Pm_val / 2; // Припускаємо, Pm - навантаження на 2 лінії
        const im_A = normCurrent(singleLineLoad_kVA);
        const impa_A = afterEmergCurrent(im_A);
        const sec_mm2 = economCrossSection(Tm_val, materialValue, insulationValue, im_A);
        const s_thermal_mm2 = thermalStabilitySection(Ik_val, Tf_val, materialValue);

        outputIn.textContent = isNaN(im_A) ? "Помилка" : im_A.toFixed(1) + " A";
        outputIae.textContent = isNaN(impa_A) ? "Помилка" : impa_A.toFixed(1) + " A";
        outputSec.textContent = isNaN(sec_mm2) ? "Помилка" : sec_mm2.toFixed(1) + " мм²";
        outputS_thermal.textContent = isNaN(s_thermal_mm2) ? "Помилка" : s_thermal_mm2.toFixed(0) + " мм²";
    });
} else {
    console.error("Button with id 'calculateButton1' not found.");
}