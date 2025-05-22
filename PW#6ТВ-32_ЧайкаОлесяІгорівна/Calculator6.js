const almostAllPn_group = 128;
const almostAllgroupK_group = 58.36;
const Pn2_sum_group = 10296;
const almostAllGroupPnTgPhi_group = 129.86;

const other_groups_sum_Pn = 1361;
const other_groups_sum_Pn_Kv = 422.2;
const other_groups_sum_Pn2 = 78384;
const other_groups_sum_Qn_tgPhi = 963.2;

let group_k_calculated_PnKv, group_p_calculated_Pn, group_gK_calculated_Kv, group_eN_calculated;
let group_pK_calculated_Kr, group_pP_calculated_Pr, group_pQ_calculated_Qr, group_reactEshr_sum_Pn_tgPhi_calculated;

let department_kPh_calculated_PnKv, department_hP_calculated_Pn, department_uKd_calculated_Kv;
let department_epN_calculated, department_pKd_calculated_Kr;

const KEstimatedActiveLoad_Y_group = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
const KEstimatedActiveLoad_X_group = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 25, 30, 35, 40, 50, 60, 80, 100];
const KEstimatedActiveLoad_Table_group = [
    [8.00,5.33,4.00,2.67,2.00,1.60,1.33,1.14,1.00],[6.22,4.33,3.39,2.45,1.98,1.60,1.33,1.14,1.00],
    [4.06,2.89,2.31,1.74,1.45,1.34,1.22,1.14,1.00],[3.24,2.35,1.91,1.47,1.25,1.21,1.12,1.14,1.00],
    [2.84,2.09,1.72,1.35,1.16,1.16,1.08,1.03,1.00],[2.64,1.96,1.62,1.28,1.14,1.13,1.06,1.01,1.00],
    [2.49,1.86,1.54,1.23,1.12,1.10,1.04,1.00,1.00],[2.37,1.78,1.48,1.19,1.10,1.08,1.02,1.00,1.00],
    [2.27,1.71,1.43,1.16,1.09,1.07,1.01,1.00,1.00],[2.18,1.65,1.39,1.13,1.07,1.05,1.00,1.00,1.00],
    [2.04,1.56,1.32,1.08,1.05,1.03,1.00,1.00,1.00],[1.94,1.49,1.27,1.05,1.02,1.00,1.00,1.00,1.00],
    [1.85,1.43,1.23,1.02,1.00,1.00,1.00,1.00,1.00],[1.78,1.39,1.19,1.00,1.00,1.00,1.00,1.00,1.00],
    [1.72,1.35,1.16,1.00,1.00,1.00,1.00,1.00,1.00],[1.60,1.27,1.10,1.00,1.00,1.00,1.00,1.00,1.00],
    [1.51,1.21,1.05,1.00,1.00,1.00,1.00,1.00,1.00],[1.44,1.16,1.00,1.00,1.00,1.00,1.00,1.00,1.00],
    [1.40,1.13,1.00,1.00,1.00,1.00,1.00,1.00,1.00],[1.30,1.07,1.00,1.00,1.00,1.00,1.00,1.00,1.00],
    [1.25,1.03,1.00,1.00,1.00,1.00,1.00,1.00,1.00],[1.16,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00],
    [1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00]
];

const KEstimatedActiveLoad_Y_department = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
const KEstimatedActiveLoad_X_department = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const KEstimatedActiveLoad_Table_department = [
    [8.00,5.33,4.00,2.67,2.00,1.60,1.33,1.14], [5.01,3.44,2.69,1.90,1.52,1.24,1.11,1.00],
    [3.40,2.17,1.80,1.42,1.23,1.14,1.08,1.00], [2.28,1.73,1.46,1.19,1.06,1.04,1.00,0.97],
    [1.81,1.42,1.22,1.02,1.00,0.98,0.96,0.94], [1.50,1.25,1.10,1.00,0.98,0.96,0.94,0.93],
    [1.30,1.15,1.05,0.98,0.96,0.94,0.93,0.92], [1.20,1.10,1.00,0.96,0.94,0.93,0.92,0.91],
    [1.10,1.05,0.98,0.94,0.93,0.92,0.91,0.90], [1.00,1.00,0.95,0.92,0.91,0.90,0.90,0.89]
];

function findTableValue(X_array, Y_array, Table, targetX, targetY) {
    let idxY = Y_array.reduce((bestIdx, currentVal, currentIdx, arr) => 
        (Math.abs(currentVal - targetY) < Math.abs(arr[bestIdx] - targetY) ? currentIdx : bestIdx), 0
    );

    let idxX = X_array.findIndex(x_val => x_val >= targetX);
    if (idxX === -1) {
        idxX = X_array.length - 1;
    } else if (idxX > 0 && X_array[idxX] > targetX && targetX >= X_array[0]) {
        idxX--;
    } else if (targetX < X_array[0]) {
        idxX = 0;
    }
    
    if (Table[idxX] && Table[idxX][idxY] !== undefined) {
        return Table[idxX][idxY];
    }
    console.warn(`No data in table for X_idx=${idxX} (targetX=${targetX}), Y_idx=${idxY} (targetY=${targetY !== undefined && !isNaN(targetY) ? targetY.toFixed(2) : 'NaN'})`);
    return NaN;
}

function calculateGroupUtilisationRate(pshlif_Pnom_s_input, kpolir_Kv_s_input) {
    const Pnom_shlif_single = pshlif_Pnom_s_input;
    const Kv_shlif_single = 0.15;
    const num_shlif = 4;

    const Pnom_polir_single = 40;
    const Kv_polir_single = kpolir_Kv_s_input;
    const num_polir = 1;

    const Pnom_cirk_single = 36;
    const Kv_cirk_single = 0.3;
    const num_cirk = 1;

    Pn_shlif_total = Pnom_shlif_single * num_shlif;
    PnKv_shlif_total = Pnom_shlif_single * Kv_shlif_single * num_shlif;

    Pn_polir_total = Pnom_polir_single * num_polir;
    PnKv_polir_total = Pnom_polir_single * Kv_polir_single * num_polir;

    Pn_cirk_total = Pnom_cirk_single * num_cirk;
    PnKv_cirk_total = Pnom_cirk_single * Kv_cirk_single * num_cirk;
    
    group_k_calculated_PnKv = almostAllgroupK_group + PnKv_shlif_total + PnKv_polir_total + PnKv_cirk_total;
    group_p_calculated_Pn = almostAllPn_group + Pn_shlif_total + Pn_polir_total + Pn_cirk_total;

    if (group_p_calculated_Pn === 0) {
        group_gK_calculated_Kv = NaN;
        return NaN;
    }
    group_gK_calculated_Kv = group_k_calculated_PnKv / group_p_calculated_Pn;
    return group_gK_calculated_Kv;
}

function calculateEffectiveNumberN_group(pshlif_Pnom_s_input) {
    const Pnom_shlif_single = pshlif_Pnom_s_input;
    const Pnom_polir_single = 40;
    const Pnom_cirk_single = 36;
    const num_shlif = 4;
    const num_polir = 1;
    const num_cirk = 1;

    const Pn2_shlif_total = num_shlif * Math.pow(Pnom_shlif_single, 2);
    const Pn2_polir_total = num_polir * Math.pow(Pnom_polir_single, 2);
    const Pn2_cirk_total = num_cirk * Math.pow(Pnom_cirk_single, 2);
    const denominator = Pn2_sum_group + Pn2_shlif_total + Pn2_polir_total + Pn2_cirk_total;

    if (denominator === 0) return NaN;
    const numerator = Math.pow(group_p_calculated_Pn, 2);
    group_eN_calculated = Math.ceil(numerator / denominator);
    return group_eN_calculated;
}

function getKActivityP_group() {
    group_pK_calculated_Kr = findTableValue(KEstimatedActiveLoad_X_group, KEstimatedActiveLoad_Y_group, KEstimatedActiveLoad_Table_group, group_eN_calculated, group_gK_calculated_Kv);
    return group_pK_calculated_Kr;
}

function calculateEstimatedActiveLoad_group() {
    if (isNaN(group_pK_calculated_Kr) || isNaN(group_k_calculated_PnKv)) return NaN;
    group_pP_calculated_Pr = group_pK_calculated_Kr * group_k_calculated_PnKv;
    return group_pP_calculated_Pr;
}

function calculateDesignReactiveLoad_group(pshlif_Pnom_s_input, tgphicirk_s_input) {
    const Pnom_shlif_single = pshlif_Pnom_s_input;
    const tgPhi_shlif_single = 1.33;
    const num_shlif = 4;

    const Pnom_polir_single = 40;
    const tgPhi_polir_single = 1.0;
    const num_polir = 1;

    const Pnom_cirk_single = 36;
    const tgPhi_cirk_single = tgphicirk_s_input;
    const num_cirk = 1;

    const Qnom_shlif_total = num_shlif * Pnom_shlif_single * tgPhi_shlif_single;
    const Qnom_polir_total = num_polir * Pnom_polir_single * tgPhi_polir_single;
    const Qnom_cirk_total = num_cirk * Pnom_cirk_single * tgPhi_cirk_single;

    group_reactEshr_sum_Pn_tgPhi_calculated = almostAllGroupPnTgPhi_group + Qnom_shlif_total + Qnom_polir_total + Qnom_cirk_total;
    
    if (isNaN(group_pK_calculated_Kr) || isNaN(group_reactEshr_sum_Pn_tgPhi_calculated)) return NaN;
    group_pQ_calculated_Qr = group_pK_calculated_Kr * group_reactEshr_sum_Pn_tgPhi_calculated;
    return group_pQ_calculated_Qr;
}

function calculateFullCapacity_group() {
    if (isNaN(group_pP_calculated_Pr) || isNaN(group_pQ_calculated_Qr)) return NaN;
    return Math.sqrt(Math.pow(group_pP_calculated_Pr, 2) + Math.pow(group_pQ_calculated_Qr, 2));
}

function calculateEstimatedGroupCurrent_group() {
    const Sp_group = calculateFullCapacity_group();
    if (Sp_group === 0 || isNaN(Sp_group)) return NaN;
    return Sp_group / (Math.sqrt(3) * 0.38);
}

function calculateUtilisationRate_department() {
    department_kPh_calculated_PnKv = group_k_calculated_PnKv + other_groups_sum_Pn_Kv;
    department_hP_calculated_Pn = group_p_calculated_Pn + other_groups_sum_Pn;
    if (department_hP_calculated_Pn === 0) {
        department_uKd_calculated_Kv = NaN;
        return NaN;
    }
    department_uKd_calculated_Kv = department_kPh_calculated_PnKv / department_hP_calculated_Pn;
    return department_uKd_calculated_Kv;
}

function calculateEffectiveNumberUnits_department(pshlif_Pnom_s_input) {
    const Pnom_shlif_single = pshlif_Pnom_s_input;
    const Pnom_polir_single = 40;
    const Pnom_cirk_single = 36;
    const num_shlif = 4;
    const num_polir = 1;
    const num_cirk = 1;
    
    const Pn2_shlif_total = num_shlif * Math.pow(Pnom_shlif_single, 2);
    const Pn2_polir_total = num_polir * Math.pow(Pnom_polir_single, 2);
    const Pn2_cirk_total = num_cirk * Math.pow(Pnom_cirk_single, 2);
    const group_Pn2_calculated_sum = Pn2_sum_group + Pn2_shlif_total + Pn2_polir_total + Pn2_cirk_total;

    const sum_Pn2_department = group_Pn2_calculated_sum + other_groups_sum_Pn2;
    if (sum_Pn2_department === 0) return NaN;
    
    const numerator_dept = Math.pow(department_hP_calculated_Pn, 2);
                                                                 
    department_epN_calculated = Math.ceil(numerator_dept / sum_Pn2_department);
    return department_epN_calculated;
}

function getKActivityP_department() {
    department_pKd_calculated_Kr = findTableValue(KEstimatedActiveLoad_X_department, KEstimatedActiveLoad_Y_department, KEstimatedActiveLoad_Table_department, department_epN_calculated, department_uKd_calculated_Kv);
    return department_pKd_calculated_Kr;
}

function calculateEstimatedActive_department() {
    if (isNaN(department_pKd_calculated_Kr) || isNaN(department_kPh_calculated_PnKv)) return NaN;
    return department_pKd_calculated_Kr * department_kPh_calculated_PnKv;
}

function calculateCalculatedJet_department() {
    const department_sum_Pn_tgPhi = group_reactEshr_sum_Pn_tgPhi_calculated + other_groups_sum_Qn_tgPhi;
    if (isNaN(department_pKd_calculated_Kr) || isNaN(department_sum_Pn_tgPhi)) return NaN;
    return department_pKd_calculated_Kr * department_sum_Pn_tgPhi;
}

function calculateFullPower_department() {
    const pP_dept = calculateEstimatedActive_department();
    const pQ_dept = calculateCalculatedJet_department();
    if (isNaN(pP_dept) || isNaN(pQ_dept)) return NaN;
    return Math.sqrt(Math.pow(pP_dept, 2) + Math.pow(pQ_dept, 2));
}

function calculateEstimatedGroup_department() {
    const Sp_dept = calculateFullPower_department();
    if (Sp_dept === 0 || isNaN(Sp_dept)) return NaN;
    return Sp_dept / (Math.sqrt(3) * 0.38);
}

const inputPShlif = document.getElementById('powerP');
const inputKUsePolir = document.getElementById('coeffK');
const inputTgPhiChur = document.getElementById('coeffQ');
const buttonClick = document.getElementById('calculateButton');

const outputGroupUtilisationRate = document.getElementById('groupUtilisationRate');
const outputEfecN_group = document.getElementById('efecN');
const outputActivePowerFactor_group = document.getElementById('activePowerFactor');
const outputEstimatedActiveLoad_group_val = document.getElementById('estimatedActiveLoad');
const outputDesignReactiveLoad_group_val = document.getElementById('designReactiveLoad');
const outputFullCapacity_group_val = document.getElementById('fullCapacity');
const outputEstimatedGroupCurrent_group_val = document.getElementById('estimatedGroupCurrent');

const outputUtilisationRate_dept = document.getElementById('utilisationRate');
const outputEffectiveNumberUnits_dept = document.getElementById('effectiveNumberUnits');
const outputCalculationCoefficient_dept = document.getElementById('calculationCoefficient');
const outputEstimatedActive_dept_val = document.getElementById('estimatedActive');
const outputCalculatedJet_dept_val = document.getElementById('calculatedJet');
const outputFullPower_dept_val = document.getElementById('fullPower');
const outputEstimatedGroup_dept_val = document.getElementById('estimatedGroup');

if (buttonClick) {
    buttonClick.addEventListener('click', function() {
        const pshlif_Pnom_single_val = parseFloat(inputPShlif.value);
        const kpolir_Kv_s_val = parseFloat(inputKUsePolir.value);
        const tgphicirk_s_val = parseFloat(inputTgPhiChur.value);
        
        if (isNaN(pshlif_Pnom_single_val) || isNaN(kpolir_Kv_s_val) || isNaN(tgphicirk_s_val) ||
            pshlif_Pnom_single_val < 0 || kpolir_Kv_s_val < 0 || tgphicirk_s_val < 0 ) {
            alert("Будь ласка, введіть коректні додатні числові значення.");
            const outputs = [outputGroupUtilisationRate, outputEfecN_group, outputActivePowerFactor_group, outputEstimatedActiveLoad_group_val, outputDesignReactiveLoad_group_val, outputFullCapacity_group_val, outputEstimatedGroupCurrent_group_val, outputUtilisationRate_dept, outputEffectiveNumberUnits_dept, outputCalculationCoefficient_dept, outputEstimatedActive_dept_val, outputCalculatedJet_dept_val, outputFullPower_dept_val, outputEstimatedGroup_dept_val];
            outputs.forEach(el => { if(el) el.textContent = 'Помилка'; });
            return;
        }

        const groupUtilisationRate_res = calculateGroupUtilisationRate(pshlif_Pnom_single_val, kpolir_Kv_s_val);
        const efN_group_res = calculateEffectiveNumberN_group(pshlif_Pnom_single_val);
        const activePowerFactor_group_res = getKActivityP_group(); 
        const estimatedActiveLoad_group_res = calculateEstimatedActiveLoad_group();
        const designReactiveLoad_group_res = calculateDesignReactiveLoad_group(pshlif_Pnom_single_val, tgphicirk_s_val);
        const fullCapacity_group_res = calculateFullCapacity_group();
        const estimatedGroupCurrent_group_res = calculateEstimatedGroupCurrent_group();
        
        const utilisationRate_dept_res = calculateUtilisationRate_department(); 
        const effectiveNumberUnits_dept_res = calculateEffectiveNumberUnits_department(pshlif_Pnom_single_val);
        const calculationCoefficient_dept_res = getKActivityP_department(); 
        const estimatedActive_dept_res = calculateEstimatedActive_department();
        const calculatedJet_dept_res = calculateCalculatedJet_department();
        const fullPower_dept_res = calculateFullPower_department();
        const estimatedGroup_dept_res = calculateEstimatedGroup_department();

        if(outputGroupUtilisationRate) outputGroupUtilisationRate.textContent = isNaN(groupUtilisationRate_res) ? 'Помилка' : groupUtilisationRate_res.toFixed(2);
        if(outputEfecN_group) outputEfecN_group.textContent = isNaN(efN_group_res) ? 'Помилка' : efN_group_res;
        if(outputActivePowerFactor_group) outputActivePowerFactor_group.textContent = isNaN(activePowerFactor_group_res) ? 'Помилка' : activePowerFactor_group_res.toFixed(2);
        if(outputEstimatedActiveLoad_group_val) outputEstimatedActiveLoad_group_val.textContent = isNaN(estimatedActiveLoad_group_res) ? 'Помилка' : estimatedActiveLoad_group_res.toFixed(2);
        if(outputDesignReactiveLoad_group_val) outputDesignReactiveLoad_group_val.textContent = isNaN(designReactiveLoad_group_res) ? 'Помилка' : designReactiveLoad_group_res.toFixed(2);
        if(outputFullCapacity_group_val) outputFullCapacity_group_val.textContent = isNaN(fullCapacity_group_res) ? 'Помилка' : fullCapacity_group_res.toFixed(3);
        if(outputEstimatedGroupCurrent_group_val) outputEstimatedGroupCurrent_group_val.textContent = isNaN(estimatedGroupCurrent_group_res) ? 'Помилка' : estimatedGroupCurrent_group_res.toFixed(2);

        if(outputUtilisationRate_dept) outputUtilisationRate_dept.textContent = isNaN(utilisationRate_dept_res) ? 'Помилка' : utilisationRate_dept_res.toFixed(2);
        if(outputEffectiveNumberUnits_dept) outputEffectiveNumberUnits_dept.textContent = isNaN(effectiveNumberUnits_dept_res) ? 'Помилка' : effectiveNumberUnits_dept_res;
        if(outputCalculationCoefficient_dept) outputCalculationCoefficient_dept.textContent = isNaN(calculationCoefficient_dept_res) ? 'Помилка' : calculationCoefficient_dept_res.toFixed(2);
        if(outputEstimatedActive_dept_val) outputEstimatedActive_dept_val.textContent = isNaN(estimatedActive_dept_res) ? 'Помилка' : estimatedActive_dept_res.toFixed(2);
        if(outputCalculatedJet_dept_val) outputCalculatedJet_dept_val.textContent = isNaN(calculatedJet_dept_res) ? 'Помилка' : calculatedJet_dept_res.toFixed(2);
        if(outputFullPower_dept_val) outputFullPower_dept_val.textContent = isNaN(fullPower_dept_res) ? 'Помилка' : fullPower_dept_res.toFixed(3);
        if(outputEstimatedGroup_dept_val) outputEstimatedGroup_dept_val.textContent = isNaN(estimatedGroup_dept_res) ? 'Помилка' : estimatedGroup_dept_res.toFixed(2);
    });
} else {
    console.error("Button with id 'calculateButton' not found.");
}