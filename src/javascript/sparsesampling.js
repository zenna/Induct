var maxInList = function(list) {
    return Math.max.apply(Math.max, list);
}

var sparseSample = function(depth, numSamples, discount, model, state, possibleActions, stateQueries) {
    var qStar = estimateQ(depth, numSamples, discount, model, state, possibleActions, stateQueries);
    var bestQStar = maxInList(qStar);
    // console.log(qStar);
    bestActionIndex = qStar.indexOf(bestQStar);
    //bestActionIndex = weightedExpSample(qStar);
    return possibleActions[bestActionIndex];
}

var estimateV = function(depth, numSamples, discount, model, state, possibleActions, stateQueries) {
    var qStar = estimateQ(depth, numSamples, discount, model, state, possibleActions, stateQueries);
    return maxInList(qStar);
}

var estimateQ = function(depth, numSamples, discount, model, state, possibleActions, stateQueries) {
    if(depth === 0) {
        return [0];
    } else {
        return possibleActions.map(function(action) {
            return sumRewards(numSamples, numSamples, depth, discount, model, state, action, possibleActions, stateQueries) / numSamples;
        });

    }
}

var sumRewards = function(sampleNum, numSamples, depth, discount, model, state, action, possibleActions, stateQueries) {
    if(sampleNum === 0) {
        return 0;
    } else {
        var stateReward = model(state, action, stateQueries);
        return stateReward[1] + discount * estimateV(depth - 1, numSamples, discount, model, stateReward[0], possibleActions, stateQueries) + sumRewards(sampleNum - 1, numSamples, depth, discount, model, state, action, possibleActions, stateQueries);
    }
}


// McMc -----------------------------------------------------------------------
var pickRandomProperty = function(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

var getProposal = function(erpType) {
	var typeToProposal = {unif:function() {return Math.random();}}
	return typeToProposal[erpType];
}

var totalAccepted = 0;
var totalRejected = 0;
var database = {};
var sparseSampleMcmc = function(depth, numSamples, discount, model, state, sampleAction, stateQueries) {
    var actionReward = traceUpdate(depth,state,model,sampleAction, stateQueries);
    actionRewards = [actionReward];
    for(var i = 0; i < numSamples; ++i) {
        var randomErp = pickRandomProperty(database);
        var dbParams = database[randomErp];
        var proposal = getProposal(dbParams['type']);
        var newErpValue = proposal(dbParams);
        var oldErpValue = dbParams['value'];
        dbParams['value'] = newErpValue;
        var newActionReward = traceUpdate(depth,state,model,sampleAction, stateQueries);
        actionRewards.push(newActionReward);
        // var f = Math.log;
        // var r = Math.log;  
        
        var loga = newActionReward[1] - actionReward[1];
        var loga2 = 0;//r - f;
        if (Math.log(Math.random()) < loga + loga2) {
        	// Do some shit
        	totalAccepted += 1;
        	actionReward = newActionReward;
        }
        else {
			dbParams['value'] = oldErpValue; 
			totalRejected += 1;
        }
    }
    
    var actionToReward = {};
    for (var i=0;i<actionRewards.length;++i) {
    	var action = actionRewards[i][0];
    	var reward = actionRewards[i][1];
    	if (action in actionToReward) {
    		actionToReward[action].push(reward);
    	}
    	else {
    		actionToReward[action] = [reward];
    	}
    }
    
    var sampledActions = [];
    var sampledActionQs = [];
    for (action in actionToReward) {
    	sampledActions.push(action);
    	sampledActionQs.push(sum(actionToReward[action]) / actionToReward[action].length);
    }
    var bestQStar = maxInList(sampledActionQs);
    bestActionIndex = sampledActionQs.indexOf(bestQStar);
    // var bestActionIndex = weightedExpSample(sampledActionQs);
    return sampledActions[bestActionIndex];
}

var traceUpdate = function(depth,state,model,sampleAction,stateQueries) {
	var totalReward = 0.0;
	var firstAction;
	for (var i=0;i<depth;++i) {
		var action = sampleAction(state);
		if (i==0) {
			firstAction = action;
		}
		var newStateReward = model(state, action, stateQueries);
		state = newStateReward[0];
		totalReward += newStateReward[1];
	}
		ii = 0;
	return [firstAction, totalReward];
}

// var ll = 1;// discounted reward of particular run of model to maxDepth
// select a random action in initial trace
// propose a new action
// compute ll2 = its discounted rewar d
// compute F = log (proposal(new action | old action))
// compute R = log (proposal(old action | new action))
// if (log(rand) < 	)
// Problems: How to compute F and R are my proposal distributions tied to the sample
// For the part of a branch after teh random switch, there will be no reuse (i.e. trees by definition never converge)
// How to ensure many actions are sampled?
// If you change a trace early on, everything is lost?

// Problems 1. How to compute proposal probabilities between two actios for non trivial action samplers
// 2. Need some means to make sure action at level 0 are sufficientl sampled
// 3. If a branch is a particular state of MC, does proposal over actions = proposal over traces?
// 4. Making proposals at low levels will induce a very different trace, which may lead to a low accepance ratio.
// 5. Should I make modifications at the sampler level
// 6. e.g sampleAction = function( {if flip, return moveLeft, else returnMoveRight})
// If the proposal isnt depend

// Ideal - fully balanced tree infinitely into future
// Unfortunately intractable and action space may be continuous
// We want to sample high reward regions - to not waste time sampling traces with poor reward probability