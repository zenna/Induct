//TODO 2.0
// 1. Define model of computation using graphs, probabilistic operators and typed functions
// Investigate primitive recursive functions
// Investigate ocaml syntax parser modification
// Investigate multiagent modelling
// Investigate intrinsic goal structure
// Update action model (move away from switch) - allow this to be learnable
// Allow program self modifications

// Place new node down and connect to another node
// Replace a node with another node
// Delete a node and subtree
// 
// Questions
// Should lambdas be definable in global space, insiwde another function, both - A) global function space for simplicity
// Different types of program are typeconsistent/inconsistent, complete/incomplete (do functions have all argumenets,), ill/well formed (tree structure).
//  - Tradeoff between ensuring consistency, completeness and well formedness at every step is between limiting space size, not wasting time on bad programs AND
//  acknowledgement that only generating valid programs may make path to even better programs ven longer.
// 
// How to fix action model
// - There is a state of the world
// - I observe part of that world which may or may not provide perfect knowledge
// - I can take actions which influence the world changing its state
// - I can not necesarily know with certainty the next state
// - states also change without my influence, as a function of time
// 
// How to handle multiple / infinite actions - can I define a MCMC chain over sparse samploing paths?
// 
// Very natural extension to modifing sparse sampling algorithm
// Just define it as an jsExpr in the main space, but how to p
// why this new distinction between reward and state?
// 

// // Learn this too
// So options, pass in action as a function moveRight
// in the real world, the action has a well defined effect
// e.g. take the program graph and add a node
// or e.g. take the agent and move it to some position
// 
// currently passing through possibleActions as string list
// and stateQueries
// 
// what if possibleActions is set of ActionTypes - assuming even infinite stateSpaces can be categorised into types with continuos parameters
// 
// possbileActions = [addNode, replaceNode, lambdarise];
// 
// what you really want is the sampler (or enumerator) maybe
// 
// pass in the sampleAction
// spareSampling would use it to sample an action
// 
// Consider different domains, gridWorld, street Figther, robot, programInduction
// gridWorld - moveUp, moveDown, moveLeft, moveRight - finite list
// streetFighter - [kick(num_seconds)] - finite categories, real valued parameters - resulting state unknown
// robot - [move(joint,angle,time)] -  finite categories, real valued parameters - resulting state unknown
// programInduction - [addNode] - finite categories - resulting state well defined
// 
// 
// Problem here is the conflict
// Does the state take an action intention and produece a new state and reward
// or Does the state apply an action to a state and produce a new state an award
// 
// 
// essentially this would make the problem of finding testMOdel a problem of finding a action, computing a new state
// then logic of finding reward still remains within testModel
// why this new distinction between reward and state?
// 
// One option is to define these lambdas in 
// 
// Problems:
// State may  vary in a manner dependent on something other than agents action
// 
// If we assume it does not vary for the moment
// Then what is the point of testModel
// 
// What is the purpose of testModel.  The purpose is to allow us to understand the structure of the world and make predictions
// Actions are not everything.  The world exists and evolves independently of our actions.
// In fact our actions are part of the world.
// 
// Underestimation unimpossibility where iare my finger going i cant keep u p i dont know how fawt they can igo  I really why is it so difficutl
// to type quickly my brain cant keep up with my speech and my speec h cant keep up with my brain my fingers are too slow for me ot oabe able to typ
// ehtis si why we need speech technology,  
// speech techmology.
// 
// The tyranny of technology

