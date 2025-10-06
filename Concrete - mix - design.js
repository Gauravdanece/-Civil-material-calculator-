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
