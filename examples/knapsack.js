var GeneticAlgorithm = new require('../lib/ga.js').GeneticAlgorithm,
    ga               = new GeneticAlgorithm(),
    elements 	     = require('./knapsack-data.json'),
    elementKeys      = Object.keys(elements)
    maxWeight        = 1000;

ga.generator = function(){
	var data = '';
	for(var j = 0; j < elementKeys.length; j++) {
		data += (Math.random() < 0.5) ? 0 : 1;
   	}
   	return data;
};

ga.objective = function(data){
	var value  = 0,
	    weight = 0;
	for(var i = 0; i < elementKeys.length; i++) {
		if(data[i] === '1'){
			value += elements[elementKeys[i]].value;
			weight += elements[elementKeys[i]].weight;
		}
    }
    if(weight > maxWeight){
    	value -= (weight - maxWeight) * 50;
    }
    return value;
};

ga.mutator = function(data, pmut){
	if(Math.random() < pmut){
		var b = '';
		var index = Math.floor(Math.random() * data.length);
    	for(var j = 0; j < data.length; j++) {
    		if(j == index){
    			if(data[j] === '0'){
    				b += '1';
    			} else {
    				b += '0';
    			}
    		}else{
    			b += data[j];
    		}
    	}
		return b;
	} else {
		return data;
	}
};

ga.end = function(statistics){
	if(statistics.bestLastChanged > 1000){
		return true;
	}
	return false;
};

ga.populationSize = 200;
ga.elitism = 5;

ga.evolve();
console.log(ga.statistics.best.data, ga.statistics.best.score());
