// Generate a random polynomial or program?
var generateRandomProgram = function() {
	var randomProgram;
	// Generate polynomial
	var maxNumVariables = 5;
	var numVariables = randInteger(1,maxNumVariables);
	var polynomial = [];
	return randomProgram;
}

// Prior probability of program
var computePrior = function(program) {
	var alpha = 1;
	return Math.exp(-alpha*program.jsExpr.length)
}

// Query 	
var approximateLikelihood = function(program, data) {
	
}

// computer the posterior probability of the program, given the data
var computePosterior = function(program, data) {
	var likelihood = approximateLikelihood(program, data);
	var prior = computePrior(program);
	return likelihood * prior;
}   

// Find posterior distribution over programs
// 1. Choose a random program
// 2. Generate canditate from proposal
// 3. Compute P(program) and P(candite) - posterior
// 4. Compute probability of program under proposal, and reverse
// 5. Accept or reject	
var inductProgram = function(numIterations) {
	var currentProgram = generateRandomProgram();
	var posterior = {};
	for (var i=0;i<numIterations;++i) {
		var candidateProgram = proposal(currentProgram);
		currentPosterior = computePosterior(currentProgram);
		candidatePosterior = computePosterior(candidateProgram);
		var posteriorRatio = candidatePosterior/currentPosterior;
		
		if (posteriorRatio > 1 || posteriorRatio < Math.random()) {
			currentProgram = candidateProgram;
		}
	}
	return posterior;
}

// Agent has model of world

var TicTacToe = function() {
	_.extend(this, Backbone.Events);
	this.scores = [0,0];
	this.board = [0,0,0,0,0,0,0,0,0];
	agent1.bind('doneMove', this.doneMove);
	
	// Return true iff there are remaining moves possible
	this.areRemainingMoves = function() {
		//
	}
	
	// Place a piece on the board
	this.placePiece = function(x,y) {
		if (x > 2 || y > 2) {
			return false;
		}
		else {
			var pieceAtPos = this.board[3*x+y];
			if (pieceAtPos != 0) {
				return false;
			}
			else {
				this.board[3*x+y] = 1;
				game.trigger('doneMove');
				return true;
			}
		}
	}
	
	this.doneMove = function() {
		
		this.currentPlayerIndex = 1 - this.currentPlayerIndex;
		this.players[this.currentPlayerIndex].trigger('move', this.board);
	}

	this.startNewGame = function(agent1,agent2) {
		this.board = [0,0,0,0,0,0,0,0,0];
		this.players = [agent1, agent2];
		agent1.bind('move', agent1.move);
		agent2.bind('move', agent2.move);
		this.currentPlayerIndex = 0;
		this.players[this.currentPlayerIndex].trigger('move', this.board);
	}	
}

var BayesianAgent = function(id) {
	this.id = id;
	_.extend(this, Backbone.Events);
	this.modelOfWorld;
	this.policy;
	this.move = function(game) {
		// Do crazy shit and make a move
		
		// Create model of world
		// Create policy
		// Act according to policy
		this.modelsOfWorld = computePosteriorOverPrograms(Data);
		
		// In most general sense.  I want to have some model of the world.
		// I want to simulate my model of the world into the future
		// And based upon these simulations, choose a policy that will maximise my expected reward
		// It's like imagining I am in a fight.  I have some model of how my oponent might react,
		// I simulate his reaction to my actions and choose the action which ends the result
		// I then act, and incorporate observed data into my model and repeat.
		for (var t=0;t<tSimDepth;++t) {
			var allPolicies = generateAllPolicies();
			for (policy in allPolicies) {
				policy();
				Sample from model of the world
				this.move
			}
		}
		
		// TODO: What's to stop agent1 repeatidly making moves when it's
		// not her turn.
		game.trigger('doneMove');
	}
}

var HumanAgent = function() {
	_.extend(this, Backbone.Events);
}

// Play numerous games
var playWorld = function(agent1, agent2, numGames) {
	// TODO - make this work without loop
	var game = new TicTacToe();
	for (var i=0;i<numGames;++i) {
		game.startNewGame(agent1, agent2);
	}
}

var bayesianAgent = new BayesianAgent(0);
var humanAgent = new HumanAgent(1);

agent.bind("alert", this.shout);
agent.trigger("alert", "an event");