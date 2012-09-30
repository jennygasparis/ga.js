var Population = require('./population.js').Population;
var Genome = require('./genome.js').Genome;

function defaultMutator(data, pmut){
	if(Math.random() < pmut){
		var b = '';
		var index = Math.floor(Math.random() * data.length);
    	for(var j = 0; j < data.length; j++) {
    		if(j == index){
	        	b += String.fromCharCode(data.charCodeAt(j)
	        		+ ((Math.random() < 0.5) ? 1 : -1) );
    		}else{
    			b += data[j];
    		}
    	}
		return b;
	} else {
		return data;
	}
}

function defaultCrossover(momData, dadData){
	var c = '',d = '';
	for(var i = 0; i < momData.length; i++){
		if(i < momData.length/2){
			c += momData[i];
			d += dadData[i];
		} else {
			d += momData[i];
			c += dadData[i];
		}
	}
	return [c, d];
}

function GeneticAlgorithm(generator, objective) {
	if (false === (this instanceof GeneticAlgorithm)) {
		return new GeneticAlgorithm();
	}

	var population;
	this.populationSize  =  40,
	this.nrGenerations   = 100,
	this.mutationRate    = 0.3,
	this.crossoverRate   = 0.9,
	this.elitism         =   1,
	this.statistics      =  {},
	this.statistics.best = new Genome(1),
	this.statistics.bestLastChanged,
	this.generator,
	this.objective,
	this.mutator,
	this.crossover;

	if(generator){
		this.generator = generator;
	}

	if(objective){
		this.objective = objective;
	}

	this.updateStatistics = function(){
		if(population.best().data === this.statistics.best.data){
			this.statistics.bestLastChanged++;
		} else {
			this.statistics.best = population.best();
			this.statistics.bestLastChanged = 0;
		}
	}

	this.done = function(){
		if(this.currentGeneration === undefined){
			throw 'Generation was not initlialized';
		}
		if((typeof this.end) === 'function'){
			return this.end(this.statistics);
		}
		return !(this.currentGeneration < this.nrGenerations);
	};

	this.initlialize = function(){

		if(!this.mutator){
			this.mutator = defaultMutator;
		}

		if(!this.crossover){
			this.crossover = defaultCrossover;
		}

		if(!this.generator || !this.objective){
			throw 'Generator and objective function need to be set.';
		}

		Genome.prototype.generate = this.generator;
		Genome.prototype.objective = this.objective;
		Genome.prototype.crossoverData = this.crossover;
		Genome.prototype.mutateData = this.mutator;

		this.currentGeneration = 0;

		population = new Population(this.populationSize);		
		population.initlialize();
		population.evaluate();
		this.updateStatistics();
	};

	this.step = function(){
		if(this.done()){
			throw 'Won\'t evolve as this ga is already done.';
		}
		population.sort();
		var newPopulation = new Population(0);
		if (this.elitism > this.populationSize){
			throw 'Can\'t perform muation as more individuals' +
			'are to elitize as there are population members';
		}
		var elitists = population.best(this.elitism);
		for(var i = 0; i < this.elitism; i++){
			newPopulation.push(elitists[i]);
		}
		for(var i = 0; newPopulation.size() < this.populationSize; i+=2){
			var mom = population.select(),
				dad = population.select(),
				c1,
				c2;
			if(Math.random() < this.crossoverRate){
				var children = mom.cross(dad);
				c1 = children[0];
				c2 = children[1];
			} else {
				c1 = mom;
				c2 = dad;
			}
			c1.mutate(this.mutationRate);
			newPopulation.push(c1);
			if((this.populationSize - newPopulation.size()) > 1){
				c2.mutate(this.mutationRate);				
				newPopulation.push(c2);
			}
		}
		population = newPopulation;
		population.evaluate();
		this.currentGeneration++;
		this.updateStatistics();
	};

	this.evolve = function(){
		this.initlialize();
		while(!this.done()){
			this.step();
		}
	};

	return this;
}

exports.GeneticAlgorithm = GeneticAlgorithm;
exports.defaultCrossover = defaultCrossover;
exports.defaultMutator   = defaultMutator;