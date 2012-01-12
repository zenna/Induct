isSymbolFunction = function(symbol) {
	if (symbol === null) {
		return false;
	}
	else if (typeof symbol === "object") {
        return true;
    }
    else {
        return false;
    }
}

processSymbols = function(funcTree) {
    var functionAsString = "";
    if (isSymbolFunction(funcTree)) {
        
        // Object has single proprety, get key
        var symbol;
        for (x in funcTree) {
            symbol = x;
        }

        functionAsString += symbol + "(";
        var numArguments = funcTree[symbol].length;
        for (var i = 0; i < numArguments; ++i) {
	        console.log("arg "+i + "\n");
            functionAsString += processSymbols(funcTree[symbol][i]);
            if (i != numArguments - 1) {
                functionAsString += ",";
            }
        }
        functionAsString += ")";
        return functionAsString;
    }
    else {
        return funcTree;
    }
}

treeFilter =  function(funcTree, filterFunc) {
	var filteredFuncs = [];
	if (isSymbolFunction(funcTree)) {

		// Object has single proprety, get key
		var symbol;
		for (x in funcTree) {
			symbol = x;
		}
		
		if (filterFunc.apply(filterFunc,[funcTree, symbol])) {
			filteredFuncs.push(funcTree);
		}
		
		var numArguments = funcTree[symbol].length;
		for (var i = 0; i < numArguments; ++i) {
			filteredFuncs = filteredFuncs.concat(treeFilter(funcTree[symbol][i],filterFunc));
		}
		return filteredFuncs;
	}
	else {
		return [];
	}
}

funcTree = {
    main: [{
        cons: [7.2, {
            plus: [3, 'x']
        }]
    }]
};

funcTreeSlot = {
    main: [{
        cons: [7.2, {
            plus: [{times:[null, 3]}, null]
        }]
    }]
};


// jsCode = processSymbols(funcTree);
a = treeFilter(funcTreeSlot,function(funcTree, symbol) {
	var numArguments = funcTree[symbol].length;
	var hasEmptySlot = false;
	for (var i = 0; i < numArguments; ++i) {
		if (funcTree[symbol][i] === null) {
			hasEmptySlot = true;
			break;
		}
	}
	return hasEmptySlot;
})