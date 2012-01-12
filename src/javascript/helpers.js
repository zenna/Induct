// Sum values in array
var sum = function(arrayToSum) {
	return arrayToSum.reduce(function(previousValue,currentValue,index,array) {
		return previousValue + currentValue;
	});
}

// Min value in array
var min = function(arrayToMin) {
	return Math.min.apply(Math.min,arrayToMin);
}

// Use exp(probabilities)
var weightedExpSample = function(weightedArray) {
	var expArray = weightedArray.map(function(weight,index) {
		return Math.exp(weight);
	});
	return weightedSample(expArray);
}

// Samples from multinomial distribution
// args; weightedArray = list of weights e.g. [9.3,0.1,100]
// Returns index of list sampled according to weight
var weightedSample = function(weightedArray) {
	var totalReward = sum(weightedArray);
	indexedArray = weightedArray.map(function(weight, index, weightedArray) {
		return sum(weightedArray.slice(0,index+1));
	});
	var randReal = Math.random() * totalReward;
	var randIndex = 0;
	for (var i=0;i<indexedArray.length;++i) {
		if (randReal <= indexedArray[i]) {
			return i;
		}
	}
	throw "Return not reached as index not found"	
}