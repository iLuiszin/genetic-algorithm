//Atividade 1
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

//Extra
function reordenarPopulacao(populacao) {
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

//Atividade 2
// Primeira Parte
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

// Segunda Parte
function decodeBinaries(populationFinal) {
  let result = []
  const nCromossomos = populationFinal.length
  const nIndividuos =
    populationFinal[0].binary.length / populationFinal[0].maxBits
  for (let i = 0; i < nIndividuos; i++) {
    let decoded = []
    for (let j = 0; j < nCromossomos; j++) {
      let binary = populationFinal[j].binary
      let maxBits = populationFinal[j].maxBits
      let chunk = binary.slice(i * maxBits, (i + 1) * maxBits)
      let decimal = parseInt(chunk, 2)
      decoded.push(decimal)
    }
    result.push(decoded)
  }
  return result
}

//Atividade 3
// Primeira Parte
function fitness(populacaoOrdenada) {
  const newPopulation = []

  for (let i = 0; i < populacaoOrdenada.length; i++) {
    newPopulation.push({
      populacao: populacaoOrdenada[i],
      aptidao: funcaoObjetiva(populacaoOrdenada[i]),
    })
  }

  return newPopulation
}

function funcaoObjetiva(x) {
  const Ncrom = x.length
  let objFunction = 10

  for (let j = 0; j < Ncrom; j++) {
    const value = x[j]
    objFunction = objFunction - value * value
  }

  return objFunction
}

//Segunda Parte
function metodoDaRoleta(populacao) {
  let somaAptidao = 0
  for (let i = 0; i < populacao.length; i++) {
    somaAptidao += populacao[i].aptidao
  }

  for (let i = 0; i < populacao.length; i++) {
    populacao[i].probabilidade = populacao[i].aptidao / somaAptidao
  }

  const faixasProbabilidade = []
  let faixaAcumulada = 0
  for (let i = 0; i < populacao.length; i++) {
    faixaAcumulada += populacao[i].probabilidade
    faixasProbabilidade.push(faixaAcumulada)
  }

  const sorteio = Math.random()
  for (let i = 0; i < faixasProbabilidade.length; i++) {
    if (sorteio <= faixasProbabilidade[i]) {
      return populacao[i]
    }
  }

  return populacao[populacao.length - 1]
}

function cross(binpop, selected) {
  selected = selected.populacao.map((el) => el.toString(2))
  selected = selected.join('')

  const cp = Math.floor(Math.random() * binpop[0].binary.length)

  const randomIndex = Math.floor(Math.random() * binpop.length)
  const randomIndividual = binpop[randomIndex]

  const filhoUm = selected.slice(0, cp) + randomIndividual.binary.slice(cp)
  const filhoDois = randomIndividual.binary.slice(0, cp) + selected.slice(cp)

  return [filhoUm, filhoDois]
}

function mutate(crossArray, pmut) {
  const nInd = crossArray.length
  const nLinhas = crossArray[0].length
  const newArray = []

  for (let i = 0; i < nInd; i++) {
    if (Math.random() < pmut) {
      const mp = Math.floor(Math.random() * nLinhas - 1) + 1

      console.log(crossArray[i][mp])

      if (crossArray[i][mp] === '1') {
        newArray.push(crossArray[i].replace('1', '0'))
      } else {
        newArray.push(crossArray[i].replace('0', '1'))
      }
    }
  }

  return newArray.length === 0 ? crossArray : newArray
}

//Resultados
const populacao = novaPopulacao(nInd, cromLimite)
const populacaoOrdenada = reordenarPopulacao(populacao)
const populationBinaria = convertToBin(populacaoOrdenada)
const populacaoFitness = fitness(populacaoOrdenada)
const selecionado = metodoDaRoleta(populacaoFitness)
const crossArray = cross(populationBinaria, selecionado)
const populacaoMutada = mutate(crossArray, 0.01)

console.log(populacao)
console.log(convertToBin(populacao))
console.log(decodeBinaries(populationBinaria))
console.log(fitness(populacaoOrdenada))
console.log(`selecionado: ${JSON.stringify(selecionado)}`)
console.log(`cross: [${crossArray}]`)
console.log(`populacaoMutada: [${populacaoMutada}]`)
