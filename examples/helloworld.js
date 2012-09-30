var GeneticAlgorithm = new require('../lib/ga.js').GeneticAlgorithm,
    ga               = new GeneticAlgorithm(),
    goal             = "Hello World!";

ga.generator = function(){
	var data = '';
	for(var j = 0; j < goal.length; j++) {
		data += String.fromCharCode(Math.floor(Math.random() * 255));
   	}
   	return data;
};

ga.objective = function(data){
	var cost = 0;
	for(var j = 0; j < goal.length; j++) {
		cost -= (data.charCodeAt(j) - goal.charCodeAt(j)) *
			(data.charCodeAt(j) - goal.charCodeAt(j));
    }
    return cost;
};

ga.end = function(statistics){
	if(statistics.best.data === goal){
		return true;
	}
	return false;
}

ga.populationSize = 200;
ga.elitism = 5;

ga.evolve();
console.log(ga.statistics.best.data);
