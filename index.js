const cromLimite = [[14,21], [1, 4], [0, 2], [0, 23]]
const nInd = 5
const nCrom = 4
let individual = []
let population = []
function novaPopulacao(nInd, cromLimite){
    let nCromossomos = cromLimite.length;
    for (let i = 0; i < nCromossomos; i++) {
        for (let j = 0; j < nInd; j++) {
            let inf = cromLimite[i][0];
            let sup = cromLimite[i][1];
            individual.push(Math.floor(Math.random() * (sup - inf + 1) + inf));
        }
        population.push(individual);
        individual = []
    }

    return population;

}


let fullString = ""
let bits = []
function convertToBin(population){
    for (let i = 0; i < population[0].length; i++) {
        for (let j = 0; j < population.length; j++) {
            let value = population[j][i];
            const valueInDecimal = value.toString(2)
             fullString += valueInDecimal
             bits.push(valueInDecimal.length)
            
        }
        console.log(fullString)
        console.log(bits)
        bits = []
        fullString = ""
    }

    return population;

}


let populacao = novaPopulacao( nInd , cromLimite);
console.log(populacao);

convertToBin(populacao)
