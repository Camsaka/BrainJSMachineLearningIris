/*
 * Guide pour l'élaboration d'un script afin d'implémenter un algorithme de classification avec Brain.js 
 */

const brain = require('brainjs');
// => Cf. https://github.com/BrainJS/brain.js

// Si CSV en local :
const readline = require('readline');
const fs = require('fs');
// => Cf. https://nodejs.org/api/readline.html

// Si CSV via une URL :
// const axios = require('axios');
// => Cf. https://github.com/axios/axios/

/**
 * Récupère les données CSV à partir d'un fichier local ou d'une URL (à choisir pour le TP)
 * @param urlOrFilename
 * @returns csvData
 */
function getCsvData(urlOrFilename) {
    var Document = fs.readFileSync(urlOrFilename).toString().split('\n');
    // console.log(Document);
    return Document;
}

/**
 * Traite les données  CSV pour avoir des données sous forme de tableau JavaScript
 * @param csvData
 * @returns rawData
 */
function parseCsv(csvData) {
    var Columns = csvData[0];
    csvData.shift();
    Columns = Columns.split(',');
    // console.log(Columns);
    var Json = []
    for (var i = 0; i < csvData.length; i++) {
        var Data = {};
        var Element = csvData[i].split(',');
        for (var j = 0; j < Element.length; j++) {
            Data[Columns[j]] = Element[j];
        }
    Json.push(Data);
    }
return Json;
}

/**
 * Prépare le jeu de données d'entraînement au format Brain.js
 * @param rawData
 * @returns trainingData
 */
function prepareTrainingData(rawData) {
        return (rawData.map((o) => ({
            input: [parseFloat(o['sepal.length']), parseFloat(o['sepal.width']), parseFloat(o['petal.length']), parseFloat(o['petal.width'])],
            output: [o['variety'] == "Setosa" ? 1 : 0, o['variety']  == "Versicolor" ? 1 : 0, o['variety']  == "Virginica" ? 1 : 0],
        })));
}


/**
 * Fonction principale du script
 */
function main() {
    var datas = getCsvData("iris.csv");

    var parsedDatas = parseCsv(datas);
    // console.log(parsedDatas);

    var trainingData = prepareTrainingData(parsedDatas);
    // console.log(trainingData);

    //Créer un NeuralNetwork de Brain.js
    let net = new brain.NeuralNetwork({
        binaryThresh: 0.5,
        hiddenLayers: [3, 3, 2],
        activation: "sigmoid",
    });
    

    
    // Entraîner le modèle (fonction train)
    net.train(trainingData, {
        iterations: 100000,
        learningRate: 0.3,
    });

    // TODO : Tester avec le lancement de prédiction (fonction run)
    var output = net.run([ 5.1, 3.5, 1.4, 0.2]);
    output = Array.from(output);
    // Astuce : la fonction run renvoie un tableau typé. Pour obtenir un tableau classique, utiliser la fonction Array.from
    outputClear = { Setosa : output[0], Versicolor : output[1], Virginica :output[2]};
    console.log(outputClear);
}

main();