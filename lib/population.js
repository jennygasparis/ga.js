var Genome   = require('./genome.js').Genome,
    Selector = require('./selector.js').Selector;

function Population(size) {
	if (false === (this instanceof Population)) {
		return new Population();
	}
	
	var population = [],
		sorted     = false,
		selector;

	this.initlialize = function(){
		for(var i = 0; i < size; i++){
			population.push(new Genome());
		}
	};

	this.sort = function(){
		if(!sorted){
			population.sort(function(a,b){
				return b.score() - a.score();
			});
			sorted = true;
		}
	};

	this.best = function(n){
		this.sort();
		if((typeof n) === 'number'){
			var list = [];
			for(var i = 0; i < n; i++){
				list.push(population[i]); //TODO use some sublist function
			}
			return list;
		}

		return population[0];
	};

	this.push = function(genome){
		population.push(genome);
	}

	this.size = function(){
		return population.length;
	};

	this.evaluate = function(){
		for(var i = 0; i < population.length; i++){
//			console.log(population, i);
			population[i].evaluate();
		}
		this.sort();
	};

	this.select = function(){
		if(!selector){
			this.sort();
			var scores = [];
			for(var i = 0; i < scores.length; i++){
				scores.push(population[i].score());
			}
			selector = new Selector(scores);
		}

		return population[selector.select()];
	};

	this.print = function(){
		console.log(population);
	};

	return this;
}

exports.Population = Population;