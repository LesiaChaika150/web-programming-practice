const ANNUAL_OPERATING_HOURS = 6451;
const AVERAGE_POWER_KW = 5.12;
const EMERGENCY_FAILURE_RATE_PER_YEAR = 0.01;

const priceEmergencyInput = document.querySelector('.e');
const pricePlannedInput = document.querySelector('.p');
const avgRepairTimeFractionInput = document.querySelector('.t');
const totalPlannedDowntimeFractionInput = document.querySelector('.k');
const calculateButton = document.querySelector('.result');
const totalLossOutput = document.querySelector('.l');

function getNumericValue(inputElement) {
    if (!inputElement) {
        return 0;
    }
    const value = Number(inputElement.value);
    return isNaN(value) ? 0 : value;
}

function calculateTotalLosses(avgRepairTimeFraction, totalPlannedDowntimeFraction, emergencyPricePerKWh, plannedPricePerKWh) {
    const energyNotSuppliedEmergency =
        EMERGENCY_FAILURE_RATE_PER_YEAR *
        avgRepairTimeFraction *
        AVERAGE_POWER_KW *
        ANNUAL_OPERATING_HOURS;

    const energyNotSuppliedPlanned =
        totalPlannedDowntimeFraction *
        AVERAGE_POWER_KW *
        ANNUAL_OPERATING_HOURS;

    const lossesFromEmergency = emergencyPricePerKWh * energyNotSuppliedEmergency;
    const lossesFromPlanned = plannedPricePerKWh * energyNotSuppliedPlanned;

    return lossesFromEmergency + lossesFromPlanned;
}

if (calculateButton) {
    calculateButton.addEventListener('click', function() {
        const emergencyPrice = getNumericValue(priceEmergencyInput);
        const plannedPrice = getNumericValue(pricePlannedInput);
        const avgRepairTime = getNumericValue(avgRepairTimeFractionInput);
        const plannedDowntime = getNumericValue(totalPlannedDowntimeFractionInput);

        const totalLoss = calculateTotalLosses(avgRepairTime, plannedDowntime, emergencyPrice, plannedPrice);

        if (totalLossOutput) {
            totalLossOutput.innerHTML = totalLoss.toFixed(0);
        }
    });
}