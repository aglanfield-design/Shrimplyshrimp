document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. FAQ Accordion Logic
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                const openAnswer = item.querySelector('.faq-answer');
                if (openAnswer) {
                    openAnswer.style.maxHeight = null;
                }
            });

            if (!isOpen) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    // 2. Clickable Water Parameters Logic
    // ==========================================
    document.querySelectorAll('.param-card').forEach(card => {
        card.addEventListener('click', function() {
            const desc = this.querySelector('.param-desc');
            if (!desc) return; // Failsafe in case a card has no description
            
            const isActive = this.classList.contains('active');

            // Close all other open parameter cards
            document.querySelectorAll('.param-card.active').forEach(openCard => {
                openCard.classList.remove('active');
                const openDesc = openCard.querySelector('.param-desc');
                if (openDesc) {
                    openDesc.style.maxHeight = null;
                    openDesc.style.marginTop = "0";
                }
            });

            // Open the clicked card
            if (!isActive) {
                this.classList.add('active');
                desc.style.maxHeight = desc.scrollHeight + 'px';
                desc.style.marginTop = "10px"; 
            }
        });
    });

    // ==========================================
    // 3. Smart Calculator Logic
    // ==========================================
    const unitToggle = document.getElementById('unit-toggle');
    const labelLength = document.getElementById('label-length');
    const labelWidth = document.getElementById('label-width');
    const labelHeight = document.getElementById('label-height');
    const calculateBtn = document.getElementById('calculate-btn');

    if (unitToggle) {
        unitToggle.addEventListener('change', function() {
            if (this.value === 'metric') {
                labelLength.innerText = 'Tank Length (cm):';
                labelWidth.innerText = 'Tank Width (cm):';
                labelHeight.innerText = 'Tank Height (cm):';
            } else {
                labelLength.innerText = 'Tank Length (Inches):';
                labelWidth.innerText = 'Tank Width (Inches):';
                labelHeight.innerText = 'Tank Height (Inches):';
            }
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const lengthInput = parseFloat(document.getElementById('tank-length').value);
            const widthInput = parseFloat(document.getElementById('tank-width').value);
            const heightInput = parseFloat(document.getElementById('tank-height').value);
            const isMetric = document.getElementById('unit-toggle').value === 'metric';

            if (!lengthInput || !widthInput || !heightInput || lengthInput <= 0 || widthInput <= 0 || heightInput <= 0) {
                alert("Please enter valid, positive dimensions for all tank measurements.");
                return;
            }

            let volGal, volLiters, footprintSqInches, soilLiters;

            if (isMetric) {
                volLiters = (lengthInput * widthInput * heightInput) / 1000;
                volGal = volLiters * 0.264172;
                footprintSqInches = (lengthInput * widthInput) / 6.4516;
                soilLiters = (lengthInput * widthInput * 5) / 1000;
            } else {
                volGal = (lengthInput * widthInput * heightInput) / 231;
                volLiters = volGal * 3.78541;
                footprintSqInches = lengthInput * widthInput;
                soilLiters = (lengthInput * widthInput * 2) / 61.02;
            }

            if (volGal < 0.5) {
                alert("These dimensions result in a tank too small to support life safely. Please check your measurements.");
                return;
            }

            let maxByFootprint = Math.floor(footprintSqInches / 2);
            let maxByVolume = Math.floor(volGal * 10);
            let maxCapacity = Math.min(maxByFootprint, maxByVolume);
            
            let starterColony = Math.max(10, Math.floor(maxCapacity * 0.15));
            if (maxCapacity < 10) starterColony = maxCapacity; 

            let moss = Math.max(1, Math.floor(volGal / 4));
            let epiphytes = Math.max(1, Math.floor(volGal / 3));
            let filterSize = volGal <= 10 ? "Small/Nano Sponge Filter" : (volGal <= 20 ? "Medium Sponge Filter" : "Large or Dual Sponge Filters");

            const resultsDiv = document.getElementById('calc-results');
            const resultsList = document.getElementById('results-list');
            const warningDiv = document.getElementById('stability-warning');
            
            if (volGal < 5) {
                warningDiv.innerHTML = "<div class='alert-box'><strong>⚠️ Warning:</strong> At " + volGal.toFixed(1) + " gallons, this tank is extremely small. Caridina Boas are highly sensitive to parameter swings. A 10+ gallon tank is recommended for beginners.</div>";
            } else {
                warningDiv.innerHTML = "";
            }

            resultsList.innerHTML = `
                <li><span class="check-icon">📐</span> <strong>Tank Stats:</strong> ~${volGal.toFixed(1)} Gallons (${volLiters.toFixed(1)} Liters) with ${footprintSqInches.toFixed(0)} sq inches of grazing footprint.</li>
                <li><span class="check-icon">🦐</span> <strong>Shrimp Colony:</strong> Start with <strong>${starterColony} Boa Shrimp</strong>. Based on grazing space, this tank will max out at ~<strong>${maxCapacity} adults</strong>.</li>
                <li><span class="check-icon">🪨</span> <strong>Active Soil:</strong> <strong>${soilLiters.toFixed(1)} Liters</strong> of soil needed for a healthy 2-inch buffering bed.</li>
                <li><span class="check-icon">🌿</span> <strong>Flora:</strong> ${moss} portion(s) of moss, ${epiphytes} epiphyte plant(s), and 1 portion of floating plants.</li>
                <li><span class="check-icon">⚙️</span> <strong>Filtration:</strong> ${filterSize} hooked to a reliable air pump.</li>
            `;
            
            resultsDiv.classList.remove('hidden');
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Select all carousels on the page
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const images = Array.from(track.children);
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let currentIndex = 0;

        // Function to slide the track
        function updateCarousel() {
            const width = carousel.clientWidth;
            track.style.transform = `translateX(-${currentIndex * width}px)`;
        }

        // Next Button Click
        nextBtn.addEventListener('click', () => {
            if (currentIndex < images.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to the first image
            }
            updateCarousel();
        });

        // Previous Button Click
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = images.length - 1; // Loop back to the last image
            }
            updateCarousel();
        });
        
        // Recalculate widths if the user resizes the browser window
        window.addEventListener('resize', updateCarousel);
    });
});