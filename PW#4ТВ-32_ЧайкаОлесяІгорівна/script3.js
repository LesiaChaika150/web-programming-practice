const Uv_kV = 115; // Напруга вищої сторони, кВ
const Un_kV = 11;  // Номінальна напруга нижчої сторони, кВ
const Xt_TR_Ohm = 233; // Опір трансформатора, приведений до Uv, Ом
const Rl_Ohm = 7.91; // Активний опір лінії, Ом
const Xl_Ohm = 4.49; // Реактивний опір лінії, Ом

let Zsh_norm_115, Zsh_min_115;
let Zsh_norm_11, Zsh_min_11;
let Zk1_norm_11, Zk1_min_11;

function calculateImpedanceAtBus_115kV(Rcs_Ohm, Xcs_Ohm) {
    const R_total_Ohm = Rcs_Ohm;
    const X_total_Ohm = Xcs_Ohm + Xt_TR_Ohm;
    return Math.sqrt(Math.pow(R_total_Ohm, 2) + Math.pow(X_total_Ohm, 2));
}

function calculateImpedanceAtBus_11kV(Z_bus_115kV_Ohm) {
    return Z_bus_115kV_Ohm * Math.pow(Un_kV / Uv_kV, 2);
}

function calculateImpedanceAtK1_11kV(Rcs_Ohm, Xcs_Ohm) {
    const Rcs_11 = Rcs_Ohm * Math.pow(Un_kV / Uv_kV, 2);
    const Xcs_11 = Xcs_Ohm * Math.pow(Un_kV / Uv_kV, 2);
    const Xt_TR_11 = Xt_TR_Ohm * Math.pow(Un_kV / Uv_kV, 2);
    const R_total_K1_Ohm = Rcs_11 + Rl_Ohm;
    const X_total_K1_Ohm = Xcs_11 + Xt_TR_11 + Xl_Ohm;
    return Math.sqrt(Math.pow(R_total_K1_Ohm, 2) + Math.pow(X_total_K1_Ohm, 2));
}

function performAllCalculations(Rc_norm_Ohm, Xc_norm_Ohm, Rc_min_Ohm, Xc_min_Ohm) {
    Zsh_norm_115 = calculateImpedanceAtBus_115kV(Rc_norm_Ohm, Xc_norm_Ohm);
    Zsh_min_115 = calculateImpedanceAtBus_115kV(Rc_min_Ohm, Xc_min_Ohm);
    Zsh_norm_11 = calculateImpedanceAtBus_11kV(Zsh_norm_115);
    Zsh_min_11 = calculateImpedanceAtBus_11kV(Zsh_min_115);
    Zk1_norm_11 = calculateImpedanceAtK1_11kV(Rc_norm_Ohm, Xc_norm_Ohm);
    Zk1_min_11 = calculateImpedanceAtK1_11kV(Rc_min_Ohm, Xc_min_Ohm);
}

function Ik3_115kV(Z_115kV) {
    if (Z_115kV === 0 || isNaN(Z_115kV)) return NaN;
    return (Uv_kV * 1000) / (Math.sqrt(3) * Z_115kV);
}
function Ik2_115kV(Ik3_115kV_A) {
    if (isNaN(Ik3_115kV_A)) return NaN;
    return Ik3_115kV_A * Math.sqrt(3) / 2;
}
function Ik3_11kV(Z_11kV) {
    if (Z_11kV === 0 || isNaN(Z_11kV)) return NaN;
    return (Un_kV * 1000) / (Math.sqrt(3) * Z_11kV);
}
function Ik2_11kV(Ik3_11kV_A) {
    if (isNaN(Ik3_11kV_A)) return NaN;
    return Ik3_11kV_A * Math.sqrt(3) / 2;
}

const inputXN = document.getElementById('normalReactance');
const inputRN = document.getElementById('normalResistance');
const inputXMin = document.getElementById('minReactance');
const inputRMin = document.getElementById('minResistance');
const btnCalculate3 = document.getElementById('calculateButton3');
const outputI3_115 = document.getElementById('threePhaseCurrent');
const outputI2_115 = document.getElementById('twoPhaseCurrent');
const outputI3N_11 = document.getElementById('realThreePhaseCurrent');
const outputI2N_11 = document.getElementById('realTwoPhaseCurrent');
const outputI3L_11 = document.getElementById('threePhaseCurrentPoint');
const outputI2L_11 = document.getElementById('twoPhaseCurrentPoint');

if (btnCalculate3) {
    btnCalculate3.addEventListener('click', function() {   
        const Xc_norm = parseFloat(inputXN.value);
        const Rc_norm = parseFloat(inputRN.value);
        const Xc_min = parseFloat(inputXMin.value);
        const Rc_min = parseFloat(inputRMin.value);
     
        if (isNaN(Xc_norm) || isNaN(Rc_norm) || isNaN(Xc_min) || isNaN(Rc_min)) {
            alert("Будь ласка, введіть коректні числові значення для всіх опорів.");
            outputI3_115.textContent = "Помилка"; outputI2_115.textContent = "Помилка";
            outputI3N_11.textContent = "Помилка"; outputI2N_11.textContent = "Помилка";
            outputI3L_11.textContent = "Помилка"; outputI2L_11.textContent = "Помилка";
            return;
        }

        performAllCalculations(Rc_norm, Xc_norm, Rc_min, Xc_min);

        const i3_sh_115_norm = Ik3_115kV(Zsh_norm_115); const i3_sh_115_min = Ik3_115kV(Zsh_min_115);
        const i2_sh_115_norm = Ik2_115kV(i3_sh_115_norm); const i2_sh_115_min = Ik2_115kV(i3_sh_115_min);
        const i3_sh_11_norm = Ik3_11kV(Zsh_norm_11); const i3_sh_11_min = Ik3_11kV(Zsh_min_11);
        const i2_sh_11_norm = Ik2_11kV(i3_sh_11_norm); const i2_sh_11_min = Ik2_11kV(i3_sh_11_min);
        const i3_k1_11_norm = Ik3_11kV(Zk1_norm_11); const i3_k1_11_min = Ik3_11kV(Zk1_min_11);
        const i2_k1_11_norm = Ik2_11kV(i3_k1_11_norm); const i2_k1_11_min = Ik2_11kV(i3_k1_11_min);

        function formatOutput(norm, min, unit = "А") {
            const normStr = isNaN(norm) ? "Помилка" : norm.toFixed(0) + " " + unit;
            const minStr = isNaN(min) ? "Помилка" : min.toFixed(0) + " " + unit;
            return `Норм: ${normStr}; Мін: ${minStr}`;
        }

        outputI3_115.textContent = formatOutput(i3_sh_115_norm, i3_sh_115_min);  
        outputI2_115.textContent = formatOutput(i2_sh_115_norm, i2_sh_115_min);
        outputI3N_11.textContent = formatOutput(i3_sh_11_norm, i3_sh_11_min);
        outputI2N_11.textContent = formatOutput(i2_sh_11_norm, i2_sh_11_min);
        outputI3L_11.textContent = formatOutput(i3_k1_11_norm, i3_k1_11_min);
        outputI2L_11.textContent = formatOutput(i2_k1_11_norm, i2_k1_11_min);
    });
} else {
     console.error("Button with id 'calculateButton3' not found.");
}