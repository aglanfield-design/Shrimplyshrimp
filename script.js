// FAQ Logic
const faqs = document.querySelectorAll(".faq-question");
console.log("program start");
faqs.forEach(faq => {
    faq.addEventListener("click", function () {
        console.log("clicked");
        this.classList.toggle("active");
        const answer = this.nextElementSibling;
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Calculator Logic
document.addEventListener("DOMContentLoaded", function() {
    const unitToggle = document.getElementById('unit-toggle');
    const labelVolume = document.getElementById('label-volume');
    const labelLength = document.getElementById('label-length');
    const labelWidth = document.getElementById('label-width');
    const calculateBtn = document.getElementById('calculate-btn');

    if (unitToggle) {
        unitToggle.addEventListener('change', function() {
            if (this.value === 'metric') {
                labelVolume.innerText = 'Tank Volume (Liters):';
                labelLength.innerText = 'Tank Length (cm):';
                labelWidth.innerText = 'Tank Width (cm):';
            } else {
                labelVolume.innerText = 'Tank Volume (Gallons):';
                labelLength.innerText = 'Tank Length (Inches):';
                labelWidth.innerText = 'Tank Width (Inches):';
            }
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const volInput = parseFloat(document.getElementById('tank-volume').value);
            const lengthInput = parseFloat(document.getElementById('tank-length').value);
            const widthInput = parseFloat(document.getElementById('tank-width').value);
            const isMetric = document.getElementById('unit-toggle').value === 'metric';

            if (!volInput || !lengthInput || !widthInput) {
                alert("Please fill out all tank dimensions to calculate your setup.");
                return;
            }

            // Convert everything to Gallons for the baseline shrimp/plant logic
            let volumeGal = isMetric ? volInput * 0.264172 : volInput;

            // 1. Shrimp Calc
            let starterColony = Math.ceil(volumeGal * 1.5);
            if (starterColony < 10) starterColony = 10; // Absolute minimum for genetic diversity
            let maxCapacity = Math.floor(volumeGal * 10);

            // 2. Soil Calc (requires 5cm / 2 inches of depth)
            let soilLiters = 0;
            if (isMetric) {
                soilLiters = (lengthInput * widthInput * 5) / 1000;
            } else {
                soilLiters = (lengthInput * widthInput * 2) / 61.02;
            }

            // 3. Plant Calc
            let moss = Math.max(1, Math.floor(volumeGal / 4));
            let epiphytes = Math.max(1, Math.floor(volumeGal / 3));

            // Populate Results
            const resultsDiv = document.getElementById('calc-results');
            const resultsList = document.getElementById('results-list');
            
            resultsList.innerHTML = `
                <li><span class="check-icon">🦐</span> <strong>Starter Colony:</strong> ${starterColony} Boa Shrimp (Your tank max capacity: ~${maxCapacity} adults).</li>
                <li><span class="check-icon">🪨</span> <strong>Active Soil:</strong> ${soilLiters.toFixed(1)} Liters needed to achieve a 2-inch buffering bed.</li>
                <li><span class="check-icon">🌿</span> <strong>Plants:</strong> ${moss} portion(s) of moss, ${epiphytes} epiphyte plant(s), and 1 portion of floaters.</li>
                <li><span class="check-icon">💧</span> <strong>Water & Diet:</strong> 100% RO/DI water remineralized to 110-130 TDS. Feed minimal Bacter AE and 1 Indian Almond leaf per 10g.</li>
            `;
            
            resultsDiv.classList.remove('hidden');
        });
    }
});