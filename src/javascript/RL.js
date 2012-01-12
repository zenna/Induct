// TODO: Integrate state queries into functions - Easy
// TODO: Work out action sampling model - HARD
// TODO: work out compilation - EASY
// TODO: Work out likelihood estimation - EASY for first implementation, HARD in general
// TODO: Reuse program at each step - EASY
// TODO: Prevent recursiveness or put time guards on these programs - MEDIUM
// TODO: Copy program to avoid desctructiveness - EASY

// If the value with specified params is stored in database, get its value
// Otherwise sample
var ii = 0;

function arrays_equal(a,b) { return !(a<b || b<a); }

var stUnif = function() {
	var theta = Array.prototype.slice.call(arguments);
	var currentParams = {type:'unif', theta:theta};
	var name = ii;
	ii += 1;
	if (name in database && currentParams.type == database[name].type) {
		var dbParams = database[name];
		if (arrays_equal(currentParams.theta,dbParams.theta)) {
			return dbParams['value'];
		}
		else {
			var l = Math.log(computeLikelihood());
			database.name.l = l;
			logLikelihood = logLikelihood + l;
		}
	}
	else {
		var sampledValue = Math.random();
		database[name] = {};
		database[name]['value'] = sampledValue;
		database[name]['type'] = 'unif';
		database[name]['theta'] = theta;
		return sampledValue;
	}
}

var stRandInteger = function(lowerBound, upperBound) {
    return Math.floor(stUnif() * (upperBound - lowerBound)) + lowerBound;
}

// TODO - make this do as intended
var stGetRandomElement = function(list) {
    return list[stRandInteger(0, list.length)];
}


var selectRlProgramModel = function(observedData, numSamples, stateQueries) {
    return testModel;
    var time = 0;n
    // Sparse Sampling Params
    var numSamples = 10;
    var depth = 7;
    var discount = 1.5;

    // Need to compile it here down to function
    return doLearning(time, new Program(observedData), new programWorld(new Program(observedData)), sampleProgramAction, selectPosteriorModel, numSamples, depth, discount, stateQueries);
}

var doLearning = function(time, observedData, state, domain, sampleAction, selectModel, numSamples, depth, discount, stateQueries) {
    if(stateQueries[0](time, state) === true) {
        console.log("New Round");
        var currentModel = selectModel(observedData, 10, stateQueries); // TODO: These args not relevant for selectRLProgramModel?
        var bestAction = sparseSampleMcmc(depth, numSamples, discount, currentModel, state, sampleAction, stateQueries);
        var newStateReward = domain.executeAction(bestAction, stateQueries);
        observedData.push(bestAction, newStateReward[1], newStateReward[0]);
        console.log(time);
        console.log(bestAction);
        setTimeout(doLearning, 100, time + 1, observedData, newStateReward[0], domain, sampleAction, selectRlProgramModel, numSamples, depth, discount, stateQueries);
    } else {
        console.log("Game Over");
        return state;
    }
}



$(document).ready(function() {
    $('body').click(function() {
        console.log("Starting RL");
        var numIterations = 5;
        var time = 0;
        // Sparse Sampling Params
        var numSamples = 1000;
        var depth = 8;
        var discount = 1.5;

        // Domain params
        var sizeX = 100;
        var sizeY = 100;
        var startPosX = 50;
        var startPosY = 50;
        var stateQueries = [canContinue, getWorldSize, getAgentPosition];
        var sampleAction = function(state) {
        	var possibleActions = ["moveUp", "moveDown", "moveLeft", "moveRight", "dontMove"];
        	return stGetRandomElement(possibleActions);
        }
        var initialState = createInitialState(sizeX, sizeY, startPosX, startPosY);
        var observedData = [initialState];
        doLearning(time, observedData, initialState, new perimeterWorld(initialState), sampleAction, selectRlProgramModel, numSamples, depth, discount, stateQueries);
    })
})