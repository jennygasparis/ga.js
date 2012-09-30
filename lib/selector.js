function Selector(scores) {
	if (false === (this instanceof Selector)) {
		return new Selector();
	}

	var negative = (scores[0] < 0);
	if(negative){
		var newScores = [],
			min       = scores[0];
		for(var i = 0; i< scores.length; i++){
			newScores.push(-min + scores[i]);
		}
		scores = newScores;
	}

	this.scores   = scores,
	this.scoresum = 0;

	for(var i = 0; i < this.scores.length; i++){
		this.scoresum += scores[i];
	}

	this.select = function(){
		var random = Math.random() * this.scoresum,
		runningSum = 0,
		id;
		for(id = 0; id < this.scores.length; id++){
			runningSum += this.scores[id];
			if(runningSum >= random){
				break;
			}
		}
		return id;
	};

	return this;
}

exports.Selector = Selector;