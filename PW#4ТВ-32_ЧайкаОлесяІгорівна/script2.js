const Sn_TR = 6.3; // Номінальна потужність трансформатора, МВА
const uk_percent_TR = 10.5; // Напруга короткого замикання трансформатора, %
let totalReactanceX; // Глобальна для X_sum

function calculateSystemReactance(Sk_sys_MVA, U_avg_nom_kV) {
    if (Sk_sys_MVA === 0 || isNaN(Sk_sys_MVA) || isNaN(U_avg_nom_kV)) return NaN;
    return Math.pow(U_avg_nom_kV, 2) / Sk_sys_MVA;
}

function calculateTransformerReactance(U_avg_nom_kV) {
    if (isNaN(U_avg_nom_kV) || Sn_TR === 0) return NaN;
    return (uk_percent_TR / 100) * (Math.pow(U_avg_nom_kV, 2) / Sn_TR);
}

function calculateTotalReactance(Sk_sys_MVA, U_avg_nom_kV) {
    const xc = calculateSystemReactance(Sk_sys_MVA, U_avg_nom_kV);
    const xt = calculateTransformerReactance(U_avg_nom_kV);
    if (isNaN(xc) || isNaN(xt)) return NaN;
    totalReactanceX = xc + xt;
    return totalReactanceX;
}

function calculateInitialFaultCurrent(U_avg_nom_kV) {
    if (isNaN(U_avg_nom_kV) || totalReactanceX === undefined || totalReactanceX === 0 || isNaN(totalReactanceX)) return NaN;
    return U_avg_nom_kV / (Math.sqrt(3) * totalReactanceX); // кА
}

const inputFaultPower = document.getElementById('faultPowerInput');
const btnCalculate2 = document.getElementById('calculateButton2');
const outputTotalResistance = document.getElementById('totalResistance');
const outputInitialCurrent = document.getElementById('initialFaultCurrent');

if (btnCalculate2) {
    btnCalculate2.addEventListener('click', function() {
        const faultPower_MVA = parseFloat(inputFaultPower.value);
        let nominalVoltage_kV;
        document.querySelectorAll('input[name="nominal-voltage"]').forEach(radio => {
            if (radio.checked) nominalVoltage_kV = parseFloat(radio.value);
        });

        if (isNaN(faultPower_MVA) || nominalVoltage_kV === undefined || faultPower_MVA <= 0) {
            alert("Будь ласка, введіть коректну потужність КЗ та виберіть напругу.");
            outputTotalResistance.textContent = "Помилка";
            outputInitialCurrent.textContent = "Помилка";
            return;
        }

        const xSum_Ohm = calculateTotalReactance(faultPower_MVA, nominalVoltage_kV);
        const ip0_kA = calculateInitialFaultCurrent(nominalVoltage_kV);
        
        outputTotalResistance.textContent = isNaN(xSum_Ohm) ? "Помилка" : xSum_Ohm.toFixed(2) + " Ом";
        outputInitialCurrent.textContent = isNaN(ip0_kA) ? "Помилка" : ip0_kA.toFixed(1) + " кA";     
    });
} else {
    console.error("Button with id 'calculateButton2' not found.");
}