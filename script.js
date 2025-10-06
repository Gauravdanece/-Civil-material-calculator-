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

// Allow only numbers and decimal point
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 46) return true; // decimal point
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

function calculateConcrete() {
    const length = parseNumber(document.getElementById('concrete-length').value);
    const width = parseNumber(document.getElementById('concrete-width').value);
    const thickness = parseNumber(document.getElementById('concrete-thickness').value);
    const gradeSelect = document.getElementById('concrete-grade');
    
    if (length <= 0 || width <= 0 || thickness <= 0) {
        alert('कृपया सभी फील्ड्स में नंबर डालें (जैसे: 2.5, 3.75, 0.15)');
        return;
    }
    
    const volume = length * width * thickness;
    const bagsPerCum = parseFloat(gradeSelect.value);
    const cementBags = volume * bagsPerCum;
    const sand = volume * 0.45;
    const aggregate = volume * 0.9;
    const water = volume * 180;
    
    // Set grade text
    const selectedOption = gradeSelect.options[gradeSelect.selectedIndex].text;
    const gradeText = selectedOption.split(' - ')[0];
    
    document.getElementById('result-grade').textContent = gradeText;
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
        alert('कृपया लंबाई और ऊंचाई में वैलिड नंबर डालें');
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
        alert('कृपया लंबाई और क्वांटिटी में वैलिड नंबर डालें');
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
        alert('कृपया सभी फील्ड्स में वैलिड नंबर डालें');
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



function calculateConcreteSlab() {
    // Get input values
    const length = parseFloat(document.getElementById('slabLength').value);
    const width = parseFloat(document.getElementById('slabWidth').value);
    const height = parseFloat(document.getElementById('slabHeight').value);
    const cementRatio = parseFloat(document.getElementById('cementRatio').value);
    const sandRatio = parseFloat(document.getElementById('sandRatio').value);
    const aggregateRatio = parseFloat(document.getElementById('aggregateRatio').value);

    // Validation
    if (!length || !width || !height || !cementRatio || !sandRatio || !aggregateRatio) {
        alert("Please fill all fields with valid numbers");
        return;
    }

    // Calculations
    const volume = length * width * height;
    const totalParts = cementRatio + sandRatio + aggregateRatio;
    
    const cementVolume = volume * (cementRatio / totalParts);
    const bagsOfCement = cementVolume / 0.035; // 1 bag = 0.035 m³
    
    const sandVolume = volume * (sandRatio / totalParts);
    const aggregateVolume = volume * (aggregateRatio / totalParts);

    // Display results
    const resultDiv = document.getElementById('concreteResult');
    resultDiv.innerHTML = `
        <h3>Concrete Slab Results:</h3>
        <p><strong>Volume of concrete needed:</strong> ${volume.toFixed(2)} m³</p>
        <p><strong>Bags of cement required:</strong> ${bagsOfCement.toFixed(1)} (${Math.ceil(bagsOfCement)} whole bags)</p>
        <p><strong>Volume of sand required:</strong> ${sandVolume.toFixed(2)} m³</p>
        <p><strong>Volume of aggregate required:</strong> ${aggregateVolume.toFixed(2)} m³</p>
        <div class="breakdown">
            <h4>Mix Ratio Breakdown:</h4>
            <p>Cement : Sand : Aggregate = ${cementRatio}:${sandRatio}:${aggregateRatio}</p>
        </div>
    `;
}


// Concrete Mix Design Calculator - IS 10262:2019
class ConcreteMixDesign {
    constructor() {
        this.gradeProperties = {
            'M10': { f_ck: 10, std_dev: 3.5, X: 5.0 },
            'M15': { f_ck: 15, std_dev: 3.5, X: 5.0 },
            'M20': { f_ck: 20, std_dev: 4.0, X: 5.5 },
            'M25': { f_ck: 25, std_dev: 4.0, X: 5.5 },
            'M30': { f_ck: 30, std_dev: 5.0, X: 6.5 },
            'M35': { f_ck: 35, std_dev: 5.0, X: 6.5 },
            'M40': { f_ck: 40, std_dev: 5.0, X: 6.5 },
            'M45': { f_ck: 45, std_dev: 5.0, X: 6.5 },
            'M50': { f_ck: 50, std_dev: 5.0, X: 6.5 }
        };

        this.exposureConditions = {
            'mild': { max_wc: 0.55, min_cement: 220 },
            'moderate': { max_wc: 0.50, min_cement: 240 },
            'severe': { max_wc: 0.45, min_cement: 320 },
            'very-severe': { max_wc: 0.40, min_cement: 340 }
        };

        this.baseWaterContent = {
            10: 208,
            20: 186,
            40: 165
        };

        this.coarseAggregateVolume = {
            10: {1: 0.48, 2: 0.50, 3: 0.52, 4: 0.54},
            20: {1: 0.60, 2: 0.62, 3: 0.64, 4: 0.66},
            40: {1: 0.69, 2: 0.71, 3: 0.72, 4: 0.73}
        };
    }

    calculateTargetStrength(grade, siteControl = 'good') {
        const props = this.gradeProperties[grade];
        let S = props.std_dev;
        
        if (siteControl === 'fair') S += 1.0;
        
        const f_ck1 = props.f_ck + 1.65 * S;
        const f_ck2 = props.f_ck + props.X;
        
        return Math.max(f_ck1, f_ck2);
    }

    getAirContent(maxSize) {
        const airContent = {10: 1.5, 20: 1.0, 40: 0.8};
        return (airContent[maxSize] || 1.0) / 100;
    }

    selectWaterCementRatio(targetStrength, cementType, exposure) {
        let wc_ratio;
        
        if (cementType.includes('53')) {
            if (targetStrength <= 30) wc_ratio = 0.50;
            else if (targetStrength <= 40) wc_ratio = 0.45;
            else if (targetStrength <= 50) wc_ratio = 0.40;
            else if (targetStrength <= 60) wc_ratio = 0.35;
            else wc_ratio = 0.30;
        } else if (cementType.includes('43')) {
            if (targetStrength <= 25) wc_ratio = 0.50;
            else if (targetStrength <= 35) wc_ratio = 0.45;
            else if (targetStrength <= 45) wc_ratio = 0.40;
            else wc_ratio = 0.35;
        } else {
            if (targetStrength <= 20) wc_ratio = 0.55;
            else if (targetStrength <= 30) wc_ratio = 0.50;
            else if (targetStrength <= 40) wc_ratio = 0.45;
            else wc_ratio = 0.40;
        }

        const max_wc = this.exposureConditions[exposure].max_wc;
        return Math.min(wc_ratio, max_wc);
    }

    calculateWaterContent(maxSize, slump, useAdmixture = false) {
        let waterContent = this.baseWaterContent[maxSize] || 186;
        
        // Adjust for slump (3% per 25mm change from 50mm)
        const slumpAdjustment = ((slump - 50) / 25) * 0.03;
        waterContent *= (1 + slumpAdjustment);
        
        // Reduce for admixture (23% for superplasticizer)
        if (useAdmixture) {
            waterContent *= 0.77;
        }
        
        return Math.round(waterContent);
    }

    calculateMixDesign(inputs) {
        const {
            grade,
            exposure,
            cementType,
            aggregateSize,
            fineAggZone,
            slump,
            spGravityCement,
            spGravityCoarse,
            spGravityFine,
            waterAbsorptionCoarse = 0.5,
            waterAbsorptionFine = 1.0
        } = inputs;

        // Step 1: Target Strength
        const targetStrength = this.calculateTargetStrength(grade);
        
        // Step 2: Air Content
        const airContent = this.getAirContent(parseInt(aggregateSize));
        
        // Step 3: Water-Cement Ratio
        const wc_ratio = this.selectWaterCementRatio(targetStrength, cementType, exposure);
        
        // Step 4: Water Content
        const waterContent = this.calculateWaterContent(parseInt(aggregateSize), parseInt(slump), true);
        
        // Step 5: Cement Content
        let cementContent = waterContent / wc_ratio;
        const minCement = this.exposureConditions[exposure].min_cement;
        if (cementContent < minCement) {
            cementContent = minCement;
        }
        cementContent = Math.round(cementContent);
        
        // Step 6: Aggregate Proportions
        const zone = parseInt(fineAggZone);
        let volCoarse = this.coarseAggregateVolume[aggregateSize][zone];
        
        // Adjust for w/c ratio
        const wcDifference = 0.50 - wc_ratio;
        const adjustment = (wcDifference / 0.05) * 0.01;
        volCoarse += adjustment;
        
        const volFine = 1 - volCoarse;
        
        // Step 7: Mix Calculations
        const volCement = cementContent / (spGravityCement * 1000);
        const volWater = waterContent / 1000; // Water SG = 1
        
        const volAllAggregate = (1 - airContent) - (volCement + volWater);
        
        const massCoarseAgg = volAllAggregate * volCoarse * spGravityCoarse * 1000;
        const massFineAgg = volAllAggregate * volFine * spGravityFine * 1000;
        
        // SSD Condition Results
        const ssdResults = {
            cement: cementContent,
            water: waterContent,
            fineAggregate: Math.round(massFineAgg),
            coarseAggregate: Math.round(massCoarseAgg),
            waterCementRatio: wc_ratio
        };
        
        // Dry Aggregate Adjustment
        const fineAggDry = Math.round(ssdResults.fineAggregate / (1 + waterAbsorptionFine/100));
        const coarseAggDry = Math.round(ssdResults.coarseAggregate / (1 + waterAbsorptionCoarse/100));
        
        const waterFromFine = ssdResults.fineAggregate - fineAggDry;
        const waterFromCoarse = ssdResults.coarseAggregate - coarseAggDry;
        const adjustedWater = waterContent + waterFromFine + waterFromCoarse;
        
        const dryResults = {
            cement: cementContent,
            water: Math.round(adjustedWater),
            fineAggregate: fineAggDry,
            coarseAggregate: coarseAggDry,
            waterCementRatio: wc_ratio
        };
        
        return {
            targetStrength,
            wc_ratio,
            airContent,
            ssdResults,
            dryResults,
            designParams: {
                grade,
                exposure,
                cementType,
                aggregateSize: aggregateSize + ' mm',
                fineAggZone: 'Zone ' + fineAggZone,
                slump: slump + ' mm'
            }
        };
    }
}

// Initialize calculator
const mixDesignCalculator = new ConcreteMixDesign();

// Calculate function
function calculateMixDesign() {
    // Get input values
    const inputs = {
        grade: document.getElementById('grade').value,
        exposure: document.getElementById('exposure').value,
        cementType: document.getElementById('cementType').value,
        aggregateSize: document.getElementById('aggregateSize').value,
        fineAggZone: document.getElementById('fineAggZone').value,
        slump: document.getElementById('slump').value,
        spGravityCement: parseFloat(document.getElementById('spGravityCement').value),
        spGravityCoarse: parseFloat(document.getElementById('spGravityCoarse').value),
        spGravityFine: parseFloat(document.getElementById('spGravityFine').value)
    };

    // Calculate mix design
    const results = mixDesignCalculator.calculateMixDesign(inputs);

    // Display results
    displayResults(results);
}

function displayResults(results) {
    // SSD Results
    document.getElementById('ssdResults').innerHTML = `
        <p><strong>Cement:</strong> ${results.ssdResults.cement} kg/m³</p>
        <p><strong>Water:</strong> ${results.ssdResults.water} kg/m³</p>
        <p><strong>Fine Aggregate:</strong> ${results.ssdResults.fineAggregate} kg/m³</p>
        <p><strong>Coarse Aggregate:</strong> ${results.ssdResults.coarseAggregate} kg/m³</p>
        <p><strong>Water-Cement Ratio:</strong> ${results.ssdResults.waterCementRatio.toFixed(3)}</p>
    `;

    // Dry Results
    document.getElementById('dryResults').innerHTML = `
        <p><strong>Cement:</strong> ${results.dryResults.cement} kg/m³</p>
        <p><strong>Water (to be added):</strong> ${results.dryResults.water} kg/m³</p>
        <p><strong>Fine Aggregate (Dry):</strong> ${results.dryResults.fineAggregate} kg/m³</p>
        <p><strong>Coarse Aggregate (Dry):</strong> ${results.dryResults.coarseAggregate} kg/m³</p>
        <p><strong>Water-Cement Ratio:</strong> ${results.dryResults.waterCementRatio.toFixed(3)}</p>
    `;

    // Design Parameters
    document.getElementById('designParams').innerHTML = `
        <p><strong>Target Strength:</strong> ${results.targetStrength.toFixed(2)} N/mm²</p>
        <p><strong>Grade:</strong> ${results.designParams.grade}</p>
        <p><strong>Exposure:</strong> ${results.designParams.exposure}</p>
        <p><strong>Aggregate Size:</strong> ${results.designParams.aggregateSize}</p>
        <p><strong>Fine Aggregate Zone:</strong> ${results.designParams.fineAggZone}</p>
    `;

    // Show results section
    document.getElementById('results').style.display = 'block';
}
