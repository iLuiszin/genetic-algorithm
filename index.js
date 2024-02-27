const cromLimite = [
    [14, 21],
    [1, 4],
    [0, 2],
    [0, 23],
]
const nInd = 5
const nCrom = 4
let individual = []
let population = []
function novaPopulacao(nInd, cromLimite) {
    let nCromossomos = cromLimite.length
    for (let i = 0; i < nCromossomos; i++) {
        for (let j = 0; j < nInd; j++) {
            let inf = cromLimite[i][0]
            let sup = cromLimite[i][1]
            individual.push(Math.floor(Math.random() * (sup - inf + 1) + inf))
        }
        population.push(individual)
        individual = []
    }

    return population
}

function convertToBin(population) {
    let fullString = ''
    let bits = []
    let decimalNumbers = []
    const populationFinal = []
    for (let i = 0; i < population[0].length; i++) {
        for (let j = 0; j < population.length; j++) {
            let value = population[j][i]
            const valueInDecimal = value.toString(2)
            decimalNumbers.push(valueInDecimal)
            bits.push(valueInDecimal.length)
        }

        const maxLengthOfBits = Math.max(...bits)
        for (let k = 0; k < population.length; k++) {
            let value = decimalNumbers[k]
            let zeros = maxLengthOfBits - value.length
            let string = ''
            for (let l = 0; l < zeros; l++) {
                string += '0'
            }
            string += value
            fullString += string
        }
        populationFinal.push({ binary: fullString, maxBits: maxLengthOfBits })

        bits = []
        decimalNumbers = []
        fullString = ''
    }

    return populationFinal
}


function decodeBinaries(populationFinal) {
    let result = [];
    const nCromossomos = populationFinal.length;
    const nIndividuos = populationFinal[0].binary.length / populationFinal[0].maxBits;
    for (let i = 0; i < nIndividuos; i++) {
        let decoded = [];
        for (let j = 0; j < nCromossomos; j++) {
            let binary = populationFinal[j].binary;
            let maxBits = populationFinal[j].maxBits;
            let chunk = binary.slice(i * maxBits, (i + 1) * maxBits);
            let decimal = parseInt(chunk, 2);
            decoded.push(decimal);
        }
        result.push(decoded);
    }
    return result;
}


let populacao = novaPopulacao(nInd, cromLimite)
console.log(populacao)

console.log(convertToBin(populacao));
let populationFinal = convertToBin(populacao)

console.log(decodeBinaries(populationFinal));