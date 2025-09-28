// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Better decimal input handling for mobile
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value;
            
            // Remove any characters that are not numbers or decimal point
            value = value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            this.value = value;
        });

        // Show numeric keyboard on mobile
        input.setAttribute('inputmode', 'decimal');
    });
});

// Improved number parsing function
function parseNumber(value) {
    if (!value || value === '') return 0;
    
    // Replace comma with dot for international support
    value = value.toString().replace(',', '.');
    
    // Parse as float
    const num = parseFloat(value);
    
    // Return 0 if invalid, otherwise return the number
    return isNaN(num) ? 0 : num;
}

function calculateConcrete() {
    const length = parseNumber(document.getElementById('concrete-length').value);
    const width = parseNumber(document.getElementById('concrete-width').value);
    const thickness = parseNumber(document.getElementById('concrete-thickness').value);
    
    if (length <= 0 || width <= 0 || thickness <= 0) {
        alert('Please enter valid numbers for all fields (e.g., 2.5, 3.75, 0.15)');
        return;
    }
    
    const volume = length * width * thickness;
    const cementBags = volume * 6.0;
    const sand = volume * 0.45;
    const aggregate = volume * 0.9;
    const water = volume * 180;
    
    document.getElementById('concrete-volume').textContent = volume.toFixed(3);
    document.getElementById('concrete-cement').textContent = cementBags.toFixed(1);
    document.getElementById('concrete-sand').textContent = sand.toFixed(3);
    document.getElementById('concrete-aggregate').textContent = aggregate.toFixed(3);
    document.getElementById('concrete-water').textContent = water.toFixed(1);
    
    document.getElementById('concrete-result').style.display = 'block';
}

function calculateBricks() {
    const length = parseNumber(document.getElementById('brick-length').value);
    const height = parseNumber(document.getElementById('brick-height').value);
    const thickness = parseFloat(document.getElementById('brick-thickness').value);
    
    if (length <= 0 || height <= 0) {
        alert('Please enter valid numbers for length and height');
        return;
    }
    
    const area = length * height;
    const bricksPerSqm = 50 * thickness;
    const totalBricks = Math.ceil(bricksPerSqm * area * 1.05);
    const mortarVolume = area * thickness * 0.2 * 0.3;
    const cementBags = mortarVolume * 1.5;
    const sand = mortarVolume * 0.3;
    
    document.getElementById('brick-area').textContent = area.toFixed(2);
    document.getElementById('brick-count').textContent = totalBricks;
    document.getElementById('brick-cement').textContent = cementBags.toFixed(1);
    document.getElementById('brick-sand').textContent = sand.toFixed(3);
    
    document.getElementById('brick-result').style.display = 'block';
}

function calculateSteel() {
    const length = parseNumber(document.getElementById('steel-length').value);
    const diameter = parseFloat(document.getElementById('steel-diameter').value);
    const quantity = parseInt(document.getElementById('steel-quantity').value) || 1;
    
    if (length <= 0 || quantity <= 0) {
        alert('Please enter valid numbers for length and quantity');
        return;
    }
    
    const weightPerMeter = (diameter * diameter) / 162;
    const weightPerBar = weightPerMeter * length;
    const totalWeight = weightPerBar * quantity;
    const totalLength = length * quantity;
    
    document.getElementById('steel-weight-single').textContent = weightPerBar.toFixed(2);
    document.getElementById('steel-weight-total').textContent = totalWeight.toFixed(2);
    document.getElementById('steel-length-total').textContent = totalLength.toFixed(2);
    
    document.getElementById('steel-result').style.display = 'block';
}

function calculatePlaster() {
    const length = parseNumber(document.getElementById('plaster-length').value);
    const height = parseNumber(document.getElementById('plaster-height').value);
    const thickness = parseFloat(document.getElementById('plaster-thickness').value) || 12;
    
    if (length <= 0 || height <= 0 || thickness <= 0) {
        alert('Please enter valid numbers for all fields');
        return;
    }
    
    const area = length * height;
    const volume = area * (thickness / 1000);
    const cementVolume = volume / 7;
    const sandVolume = volume * 6/7;
    const cementBags = cementVolume * 30;
    
    document.getElementById('plaster-area').textContent = area.toFixed(2);
    document.getElementById('plaster-cement').textContent = Math.ceil(cementBags);
    document.getElementById('plaster-sand').textContent = sandVolume.toFixed(3);
    document.getElementById('plaster-volume').textContent = volume.toFixed(3);
    
    document.getElementById('plaster-result').style.display = 'block';
}
