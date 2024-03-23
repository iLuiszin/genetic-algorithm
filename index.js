const fs = require('fs');

// ETAPA 1 - GERAR POPULAÇÃO

// Definir os parâmetros do problema
const num_cromossomos = 4;
const num_alunos = 5;
const num_grupos = 2;

function copiarArrayPorValor(arr) {
    return JSON.parse(JSON.stringify(arr));
}

// Função para embaralhar uma lista
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Inicializar os cromossomos
const cromossomos = [];


let alunos = []
for (let i = 0; i < num_alunos; i++) {
    const aluno = {
        "Identificação": `Aluno_${i + 1}`,
        "Grupo": null,
        "Idade": Math.floor(Math.random() * (75 - 17 + 1)) + 17,
        "Disciplina": Math.floor(Math.random() * 4) + 1,
        "Tempo de Acesso": Math.floor(Math.random() * 181),
        "Hora de Acesso": Math.floor(Math.random() * 24)
    };
    alunos.push(aluno);
}

for (let c = 0; c < num_cromossomos; c++) {
    let cromossomo = [];
    const alunos_por_grupo = Math.floor(num_alunos / num_grupos);
    const grupos = Array.from({length: num_grupos}, (_, i) => i + 1).flatMap(grupo => Array(alunos_por_grupo).fill(grupo));
    const remaining_students = num_alunos - alunos_por_grupo * num_grupos;

    const random_groups = Array.from({length: remaining_students}, () => Math.floor(Math.random() * num_grupos) + 1);

    grupos.push(...random_groups);
    shuffle(grupos);

    cromossomo.push(...alunos.map((aluno, i) => ({...aluno, "Grupo": grupos[i]})));

    cromossomos.push(cromossomo);
}


// Salvar cromossomos em um arquivo CSV
fs.writeFileSync('cromossomos.csv', cromossomos.map(cromossomo => cromossomo.map(aluno => Object.values(aluno).join(',')).join('\n')).join('\n\n'));

// ETAPA 2 - NORMALIZAR CARACTERÍSTICAS
// Função para normalizar as características
function normalizarCaracteristicas(data) {
    let toReturn = copiarArrayPorValor(data);
    let min_idade = Infinity,
        max_idade = -Infinity,
        min_disciplina = Infinity,
        max_disciplina = -Infinity,
        min_tempo_acesso = Infinity,
        max_tempo_acesso = -Infinity,
        min_hora = Infinity,
        max_hora = -Infinity;

    // Encontrar os valores mínimos e máximos para cada característica
    for (const cromossomo of toReturn) {
        for (const aluno of cromossomo) {
            min_idade = Math.min(min_idade, aluno["Idade"]);
            max_idade = Math.max(max_idade, aluno["Idade"]);
            min_disciplina = Math.min(min_disciplina, aluno["Disciplina"]);
            max_disciplina = Math.max(max_disciplina, aluno["Disciplina"]);
            min_tempo_acesso = Math.min(min_tempo_acesso, aluno["Tempo de Acesso"]);
            max_tempo_acesso = Math.max(max_tempo_acesso, aluno["Tempo de Acesso"]);
            min_hora = Math.min(min_hora, aluno["Hora de Acesso"]);
            max_hora = Math.max(max_hora, aluno["Hora de Acesso"]);
        }
    }

    // Normalizar as características para cada aluno
    for (const cromossomo of toReturn) {
        for (const aluno of cromossomo) {
            aluno["Idade"] = parseFloat(((aluno["Idade"] - min_idade) / (max_idade - min_idade)).toFixed(3));
            aluno["Disciplina"] = parseFloat(((aluno["Disciplina"] - min_disciplina) / (max_disciplina - min_disciplina)).toFixed(3));
            aluno["Tempo de Acesso"] = parseFloat(((aluno["Tempo de Acesso"] - min_tempo_acesso) / (max_tempo_acesso - min_tempo_acesso)).toFixed(3));
            aluno["Hora de Acesso"] = parseFloat(((aluno["Hora de Acesso"] - min_hora) / (max_hora - min_hora)).toFixed(3));
        }
    }
    return toReturn;
}

let cromossomoss = normalizarCaracteristicas(cromossomos);


// Salvar cromossomos normalizados em um arquivo CSV
fs.writeFileSync('cromossomos_normalizados.csv', cromossomoss.map(cromossomo => cromossomo.map(aluno => Object.values(aluno).join(',')).join('\n')).join('\n\n'));
// ETAPA 3 - GERAR CENTROIDE DAS CARACTERÍSTICAS

// Função para calcular a média das características
function calcularMediaCaracteristicas(data) {
    let medias = [];

    for (let i = 0; i < data.length; i++) {
        const cromossomo = data[i];
        for (let grupo = 1; grupo <= num_grupos; grupo++) {
            const grupoDados = cromossomo.filter(aluno => aluno["Grupo"] === grupo);

            // Calcular a média das características para o grupo atual
            if (grupoDados.length > 0) {
                const grupoMedia = {
                    "Cromossomo": i + 1,
                    "Grupo": grupo,
                    "Média Idade": parseFloat((grupoDados.reduce((acc, aluno) => acc + aluno["Idade"], 0) / grupoDados.length).toFixed(3)),
                    "Média Disciplina": parseFloat((grupoDados.reduce((acc, aluno) => acc + aluno["Disciplina"], 0) / grupoDados.length).toFixed(3)),
                    "Média Tempo de Acesso": parseFloat((grupoDados.reduce((acc, aluno) => acc + aluno["Tempo de Acesso"], 0) / grupoDados.length).toFixed(3)),
                    "Média Hora de Acesso": parseFloat((grupoDados.reduce((acc, aluno) => acc + aluno["Hora de Acesso"], 0) / grupoDados.length).toFixed(3))
                };
                medias.push(grupoMedia);
            } else {
                const grupoMedia = {
                    "Cromossomo": `${i + 1}`,
                    "Grupo": grupo,
                    "Média Idade": 0,
                    "Média Disciplina": 0,
                    "Média Tempo de Acesso": 0,
                    "Média Hora de Acesso": 0
                };
                medias.push(grupoMedia);
            }
        }
    }


    return medias;
}

const mediasGruposCromossomos = calcularMediaCaracteristicas(cromossomoss);


// Salvar médias em um arquivo CSV
fs.writeFileSync('medias.csv', mediasGruposCromossomos.map(media => Object.entries(media).map(([key, value]) => `${key}: ${value}`).join(',')).join('\n'));

// ETAPA 3.1 - CALCULAR A DISTÂNCIA EUCLIDIANA


function calculateEuclDistance(alunos, grupo) {
    let alunosCopy = copiarArrayPorValor(alunos);

    for (let i = 0; i < alunosCopy.length; i++) {
        for (let g = 0; g < alunosCopy[i].length; g++) {
            let grupoAluno = alunosCopy[i][g];

            let grupoCorrespondente = grupo.find(item => item["Grupo"] === grupoAluno["Grupo"] && item.Cromossomo === (i + 1));
            let idade = grupoCorrespondente['Média Idade'];


            let disciplina = grupoCorrespondente['Média Disciplina'];

            let tempo = grupoCorrespondente['Média Tempo de Acesso'];

            let hora = grupoCorrespondente['Média Hora de Acesso'];


            let idadeNova = Math.abs(alunosCopy[i][g].Idade - idade);
            alunosCopy[i][g].Idade = idadeNova;
            let disciplinaNova = Math.abs(alunosCopy[i][g].Disciplina - disciplina);
            alunosCopy[i][g].Disciplina = disciplinaNova;
            let tempoNova = Math.abs(alunosCopy[i][g]["Tempo de Acesso"] - tempo);
            alunosCopy[i][g]["Tempo de Acesso"] = tempoNova;
            let horaNova = Math.abs(alunosCopy[i][g]["Hora de Acesso"] - hora);
            alunosCopy[i][g]["Hora de Acesso"] = horaNova;
        }
    }
    return alunosCopy
}

let euclideDistanc = calculateEuclDistance(cromossomoss, mediasGruposCromossomos);

function soma(euclideDistanc) {
    let somaAlunos = [];
    for (let i = 0; i < euclideDistanc.length; i++) {
        for (let g = 0; g < euclideDistanc[i].length; g++) {
            let aluno = euclideDistanc[i][g];
            let alunoNome = aluno.Identificação;
            let somaIndividual = aluno.Idade + aluno.Disciplina + aluno["Tempo de Acesso"] + aluno["Hora de Acesso"];
            somaAlunos.push([alunoNome, i, aluno.Grupo, somaIndividual]);
        }
    }
    return somaAlunos;
}

let somaAlunos = soma(euclideDistanc);


function somaGruposs(somaAlunos) {
    let somatoriaGrupo = [];
    let index = somaAlunos.length
    for (let i = 0; i < index; i++) {
        somatoriaGrupo.push([somaAlunos[i][1], somaAlunos[i][3]])
    }
    const resultado = {};

    somatoriaGrupo.forEach(item => {
        const chave = item[0];
        const valor = item[1];

        if (resultado[chave] === undefined) {
            resultado[chave] = valor;
        } else {
            resultado[chave] += valor;
        }
    });

    return resultado;
}

let somaGrupos = somaGruposs(somaAlunos);


function applyFitness(somaGrupos) {
    let fitness = [];
    let resultado = {}
    let i = 0;

    while (somaGrupos[i] !== undefined) {
        let grupo = somaGrupos[i];
        let fitnessNumber = 100 / (1 + grupo);
        resultado = {cromossomo: i, fitness: fitnessNumber}
        fitness.push(resultado)
        i++
    }

    return fitness
}

const fitness = applyFitness(somaGrupos);
const fitnessPai = applyFitness(somaGrupos);

function metodoDaRoleta(populacao) {
    let somatoria = 0;
    let rand = Math.random();
    let index = 0;
    populacao.forEach(item => {
        somatoria += item;
    })
    let roleta = [];
    populacao.forEach(item => {
        roleta.push(item.fitness / somatoria);
    })


    while (index < roleta.length) {
        rand -= roleta[index];
        if (rand < 0) {
            return index;
        }
        index++;
    }

    return roleta.length - 1;

}

function crossover(cromossomo1, cromossomo2, mascara) {
    let filho1 = [];
    let filho2 = [];
    for (let i = 0; i < cromossomo1.length; i++) {
        if (mascara[i] === 1) {
            filho1.push(cromossomo1[i]);
            filho2.push(cromossomo2[i]);
        } else {
            filho1.push(cromossomo2[i]);
            filho2.push(cromossomo1[i]);
        }
    }
    return [filho1, filho2]
}

function generateMask(num_alunos) {
    let mask = [];
    for (let i = 0; i < num_alunos; i++) {
        if (i % 2 === 0) {
            mask.push(1)
        } else {
            mask.push(0)
        }
    }
    return mask
}

let mascara = generateMask(num_alunos)


let escolhido = fitness.splice(metodoDaRoleta(fitness), 1)[0].cromossomo
let escolhido2 = fitness.splice(metodoDaRoleta(fitness), 1)[0].cromossomo
let filhos = crossover(cromossomoss[escolhido], cromossomoss[escolhido2], mascara)


function mutation(filhos, pmut) {
    for (let i = 0; i < filhos.length; i++) {
        if (Math.random() < pmut) {
            let generated = Math.floor(Math.random() * num_grupos) + 1

            while (generated === filhos[i][0]["Grupo"]) {
                generated = Math.floor(Math.random() * num_grupos) + 1
            }
            filhos[i][0]["Grupo"] = generated
        }
    }


}

mutation(filhos, 0.5)

//CALCULANDO MÉDIA DAS CARACTERISTICAS DOS FI

const mediaFilho = calcularMediaCaracteristicas(filhos)

//CALCULANDO DISTANCIA EUCLIDIANA DOS FILHOS
let euclideDistancFilhos = calculateEuclDistance(filhos, mediaFilho);

//SOMANDO AS DISTANCIAS
let somaAlunosFilhos = soma(euclideDistancFilhos);

//SOMANDO AS DISTANCIAS DOS GRUPOS
let somaGruposFilhos = somaGruposs(somaAlunosFilhos);

//APLICANDO O FITNESS

let fitnessFilhos = applyFitness(somaGruposFilhos)

fitnessFilhos.forEach(item => {
    item.filho = true
})

fitnessPai.push(...fitnessFilhos)

fitenessPaiSorted = fitnessPai.sort((a, b) => b.fitness - a.fitness)

theBestOnes = fitenessPaiSorted.slice(0, num_cromossomos)

let theNewPopulation = []

theBestOnes.forEach(
    item => {
        if (!item.filho) {
            theNewPopulation.push(cromossomoss[item.cromossomo])
        } else {
            theNewPopulation.push(filhos[item.cromossomo])
        }
    }
)




