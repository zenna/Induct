// Initial program is random tree, empty tree, or tree which matches data (data incorporatio).
// Function set includes ERPs, stateQueries, canonical function set
// Possible actions: delete a node, switch a link, add a node,

var selectPosteriorModel = function(observedData, numSamples, stateQueries) {
    return posteriorModel;
}

// Log length Prior
var computeLogPrior = function(model) {
	var alpha = 1;
    return -alpha*model.length;
}

var computePosterior = function(model, observedData) {
    var logPrior = computeLogPrior(model);
    var logLikelihood = computeLogLikelihood(model, observedData, numSamples);
    return logPrior + logLikelihood;
}

// TODO
var computeLogLikelihood = function(observedData, numSamples) {
    for(var i = 0; i < observedData.length; ++i) {
        for(var j = 0; j < numSamples; ++j) {
            observedData[i]['state'];
            observedData[i]['action'];
            newStateReward = model(observedData[i]['state'], observedData[i]['action']);
            var stateSimilarity = stateSimilarity(observedData[i]['state'], observedData[i]['action']);
            var rewardSimularity = computeRewardSimilarity(observedData[i]['state'], observedData[i]['action']);
        }
    }
}

// Domain specific
var computeStateSimilarity = function(state1, state2) {
    //
}

// Weird
var computeRewardSimilarity = function(reward1, reward2) {
    return Math.abs(reward1 - reward2);
}

// Has to return executable function
// TODO: 
posteriorModel = function(state, action, actionParams, stateQueries) {
	var newState = state.copy(); // TODO - Copy state
	action[0].apply(newState, action[1]);
    var reward = computePosterior(newState, newState.observedData, numSamples);
    return [newState, reward];
}

var programWorld = function(initialState) {
    this.state = initialState;

    this.executeAction = function(action, actionParams, stateQueries) {
        var stateReward = posteriorModel(this.state, action, actionParams, stateQueries);
        this.state = stateReward[0];
        return stateReward;
    }

}