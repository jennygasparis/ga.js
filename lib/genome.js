function Genome(data) {
	if (false === (this instanceof Genome)) {
		return new Genome();
	}
	this.data;
	var score;

	if(data){
		this.data = data;
	} else {
		this.data = this.generate();
	}

	this.evaluate = function(){
		score = this.objective(this.data);
	};

	this.score = function(){
		if (score){
			return score;
		}

		score = this.objective(this.data);
		return score;
	};

	this.mutate = function(pmut){
		this.data = this.mutateData(this.data, pmut);
		score = undefined;
	};

	this.cross = function(other){
		var dataArray = this.crossoverData(this.data, other.data);
		return [new Genome(dataArray[0]), new Genome(dataArray[1])]; //TODO use map
	};
	
	return this;
}

exports.Genome = Genome;