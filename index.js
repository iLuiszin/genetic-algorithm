//Gerando população
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

    for (let j = 0; j < nInd; j++) {
        for (let i = 0; i < nCromossomos; i++) {
            let inf = cromLimite[i][0]
            let sup = cromLimite[i][1]
            individual.push(Math.floor(Math.random() * (sup - inf + 1) + inf))
        }
        population.push(individual)
        individual = []
    }

    return population
}

function catchValuesArray(populacao) {
    const numLinhas = populacao.length
    const numColunas = populacao[0].length

    const novaPopulacao = []

    for (let i = 0; i < numColunas; i++) {
        novaPopulacao.push([])
    }

    for (let i = 0; i < numLinhas; i++) {
        for (let j = 0; j < numColunas; j++) {
            novaPopulacao[j].push(populacao[i][j])
        }
    }

    return novaPopulacao
}

function normalize(population) {
    const minsAndMaxs = [];

    catchValuesArray(population).forEach((valuesForNormalize) => {
        const [min, max] = normalizeAux(valuesForNormalize)
        minsAndMaxs.push([min, max])
    })

    population.forEach((individual) => {
        for (let i = 0; i < individual.length; i++) {
            individual[i] = Number(((individual[i] - minsAndMaxs[i][0]) / (minsAndMaxs[i][1] - minsAndMaxs[i][0])).toFixed(2))
        }
    })

    return population

}

function normalizeAux(valuesForNormalize) {
    const min = Math.min(...valuesForNormalize)
    const max = Math.max(...valuesForNormalize)

    return [min, max]
}

function fXFunction(characteristic, avg) {
    let sum = 0
    for (let i = 0; i < characteristic.length; i++) {
        sum += Math.abs(characteristic[i] - avg[i])
    }
    return sum
}

//Atividade 3
// Primeira Parte
//function fitness(populacaoOrdenada) {
//  const newPopulation = []
//
//  for (let i = 0; i < populacaoOrdenada.length; i++) {
//    newPopulation.push({
//      populacao: populacaoOrdenada[i],
//      aptidao: funcaoObjetiva(populacaoOrdenada[i]),
//    })
//  }
//
//  return newPopulation
//}
//
//function funcaoObjetiva(x) {
//  const Ncrom = x.length
//  let objFunction = 10
//
//  for (let j = 0; j < Ncrom; j++) {
//    const value = x[j]
//    objFunction = objFunction - value * value
//  }
//
//  return objFunction
//}
//
////Segunda Parte
//function metodoDaRoleta(populacao) {
//  let somaAptidao = 0
//  for (let i = 0; i < populacao.length; i++) {
//    somaAptidao += populacao[i].aptidao
//  }
//
//  for (let i = 0; i < populacao.length; i++) {
//    populacao[i].probabilidade = populacao[i].aptidao / somaAptidao
//  }
//
//  const faixasProbabilidade = []
//  let faixaAcumulada = 0
//  for (let i = 0; i < populacao.length; i++) {
//    faixaAcumulada += populacao[i].probabilidade
//    faixasProbabilidade.push(faixaAcumulada)
//  }
//
//  const sorteio = Math.random()
//  for (let i = 0; i < faixasProbabilidade.length; i++) {
//    if (sorteio <= faixasProbabilidade[i]) {
//      return populacao[i]
//    }
//  }
//}

//Resultados
const populacao = novaPopulacao(nInd, cromLimite)
console.log(populacao)
console.log(normalize(populacao))
