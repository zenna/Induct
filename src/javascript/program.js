// TODO:
// Prevent using main
// 2. Test on symoblic regression problem
// 3. Implement lambarise, replaceNode, deleteNode,
// 3. Implement into RL (i.e. sparse sampling)
// 4. Implement local variables with let
// 6. Implement timing constraints
// 5. More complex typing system
//
// 1. Investigate guaranteed halting recursive schemes (e.g. primitive recursion, typed)
// 2. Investigate giving partial credit to non halting programs (e.g. functional reactive programming)
// 3. Make action sampling under modification
// 4. Allow first class functions
// 5. Allow generation of own actions
// 6. L
// This is a the program generator

function Program(observedData) {
	this.observedData = observedData;
	this.length = 0;
    this.functions = {
        'main' : {
            modifyable : true,
            typeSig : [['number', 'number'], 'list'],
            codeAsTree : {
                main : [null, null]
            },
            __dirty : true
        },
        'plus' : {
            modifyable : false,
            typeSig : [['number', 'number'], 'number'],
            codeAsFunction : function(a, b) {
                return a + b;
            }

        },
        'minus' : {
            modifyable : false,
            typeSig : [['number', 'number'], 'number'],
            codeAsFunction : function(a, b) {
                return a - b;
            }

        },
        'mul' : {
            modifyable : false,
            typeSig : [['number', 'number'], 'number'],
            codeAsFunction : function(a, b) {
                return a * b;
            }

        },
        'gDiv' : {
            modifyable : false,
            typeSig : [['number', 'number'], 'number'],
            codeAsFunction : function(a, b) {
                return b === 0 ? 0 : a / b;
            }

        },
        'sum' : {
            modifyable : false,
            typeSig : [['list'], 'number'],
            codeAsFunction : function(arrayToSum) {
                return arrayToSum.reduce(function(previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                });

            }

        },
        'cons' : {
            modifyable : false,
            typeSig : [['number', 'number'], 'list'],
            codeAsFunction : function(a, b) {
                return [a, b];
            }

        }
    }
    this.codeAsString = "";
    this.__dirty == true;

    // Makes (locally to this object) unique function name e.g. f1231
    this.makeGuid = function() {
        var guid;
        do {
            guid = 'f' + parseInt(Math.random() * 1000000);
        } while (guid in this.functions);
        return guid;
    }

    // Todo actually compile
    this.compileAll = function() {
        // if dirty
        for(func in this.functions) {
            this.compileFunction(this.functions[func]);
        }
    }

    // Convert tree or list expression into compiled code
    this.compileFunction = function(func) {
        if(func['__dirty'] === true) {
            func['codeAsString'] = this.processSymbols(func['codeAsTree']);
            func['codeAsFunction'] = new Function(func['codeAsString']);
            func['__dirty'] = false;
        }
    }

    // Is a node in codeAsTree a function or not?
    this.isSymbolFunction = function(symbol, isNullOk) {
        if(symbol === null) {
            if(isNullOk === true) {
                return false;
            } else {
                throw "Null in tree, cannot build";
            }
        } else if( typeof symbol === "object") {
            return true;
        } else {
            return false;
        }
    }

    // Reursively compile codeAsTree into codeAsString
    this.processSymbols = function(funcTree) {
        var functionAsString = "";
        if(this.isSymbolFunction(funcTree, false)) {

            // Object has single proprety, get key
            var symbol;
            for(x in funcTree) {
                symbol = x;
            }
            functionAsString += symbol + "(";
            var numArguments = funcTree[symbol].length;
            for(var i = 0; i < numArguments; ++i) {
                functionAsString += processSymbols(funcTree[symbol][i]);
                if(i != numArguments - 1) {
                    functionAsString += ",";
                }
            }
            functionAsString += ")";
            return functionAsString;
        } else {
            return funcTree;
        }
    }


    this.findLocalVariables = function(func) {
        var localVariables = {};
        var typeSig = this.functions[func]['typeSig'][0];
        for(var i = 0; i < typeSig.length; ++i) {
            localVariables[func + "_a" + i] = {
                typeSig : [typeSig[i]]
            };
        }
        return localVariables;
    }

    // Recurse through funcTree building filtered list
    this.treeFilter = function(funcTree, filterFunc) {
        var filteredFuncs = [];
        if(this.isSymbolFunction(funcTree, true)) {

            // Object has single proprety, get key
            var symbol;
            for(x in funcTree) {
                symbol = x;
            }

            if(filterFunc.apply(filterFunc, [funcTree, symbol])) {
                filteredFuncs.push(funcTree);
            }

            var numArguments = funcTree[symbol].length;
            for(var i = 0; i < numArguments; ++i) {
                filteredFuncs = filteredFuncs.concat(this.treeFilter(funcTree[symbol][i], filterFunc));
            }
            return filteredFuncs;
        } else {
            return [];
        }
    }


    this.treeRecursiveDraw = function(funcTree, graph) {
        var filteredFuncs = [];
        var name = this.makeGuid();
        if(this.isSymbolFunction(funcTree, true)) {
            // Object has single proprety, get key
            var symbol;
            for(x in funcTree) {
                symbol = x;
            }
            graph.addNode(name, {
                label : symbol //,
            });
            var st = {
                directed : true
            };
            var numArguments = funcTree[symbol].length;
            for(var i = 0; i < numArguments; ++i) {
                var childName = this.treeRecursiveDraw(funcTree[symbol][i], graph);
                graph.addEdge(name, childName, st);
            }
        } else {
            graph.addNode(name, {
                label : "" + funcTree //,
            });
        }
        return name;
    }

    // Draw all the functions
    this.draw = function(index) {
        var width = 400;
        var height = 400;
        var graphs = [];
        var renderers = [];
        var layouters = [];

        var i = 0;
        for(func in this.functions) {
            if(this.functions[func]['modifyable'] === true) {
                if(i === index || typeof (index) === 'undefined') {
                    graphs[i] = new Graph();

                    // var gr = new Graph();
                    $('#canvas').append("<div id='" + func + "Div' class='programBox'></div>");
                    this.treeRecursiveDraw(this.functions[func]['codeAsTree'], graphs[i])
                    /* layout the graph using the Spring layout implementation */
                    layouters[i] = new Graph.Layout.Spring(graphs[i]);
                    /* draw the graph using the RaphaelJS draw implementation */
                    renderers[i] = new Graph.Renderer.Raphael(func + "Div", graphs[i], width, height);
                }
                i = i + 1;
            }
        }
        redraw = function() {
            layouter.layout();
            renderer.draw();
        };

        hide = function(id) {
            g.nodes[id].hide();
        };

        show = function(id) {
            g.nodes[id].show();
        };

    }

}

// Actions	------------------- this is bound to program object.
var addBoundNode = function(child, parent, parentSymbol, argPos) {
    var childSymbol;
    // TOdo: more elegant
    for(var x in child) {
        childSymbol = x;
    }
    if(child[childSymbol]['typeSig'].length === 1) {
        // Am a variable
        parent[parentSymbol][argPos] = childSymbol;
    } else if(child[childSymbol]['typeSig'].length === 2) {
        // Am a function
        var numArgs = this.functions[childSymbol]['typeSig'][0].length;
        var nullArgs = [];
        for(var i = 0; i < numArgs; ++i) {
            nullArgs.push(null);
        }
        parent[parentSymbol][argPos] = {};
        parent[parentSymbol][argPos][childSymbol] = nullArgs;
    } else {
        throw "typeSig length is wrong";
    }
    this.length += 1;
}

var replace = function(func) {
}

var lambdarise = function() {
}

var doNothing = function() {
}

// TODO: Where does typeSig come from?
this.makeLambda = function(typeSig) {
    var numArgs = typeSig[0].length;
    var nullArgs = [];
    for(var i = 0; i < numArgs; ++i) {
        nullArgs.push(null);
    }
    var funcName = this.makeGuid();
    this.functions[funcName] = {
        modifyable : true,
        __dirty : true,
        typeSig : typeSig,
        codeAsTree : {}
    };
    this.functions[funcName]['codeAsTree'][funcName] = nullArgs;
}

// ------------------------------------------------------------------

var flip = function() {
    return;
}

var randInteger = function(lowerBound, upperBound) {
    return Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
}

// TODO - make this do as intended
var getRandomElement = function(list, erp, erpParams) {
    return list[randInteger(0, list.length)];
}

// Action sampler, returns function => [listOfArguments]
var sampleProgramAction = function(program) {
    var topLevelActions = [addBoundNode, addBoundNode, addBoundNode, addBoundNode, doNothing, makeLambda];
    var actionType = getRandomElement(topLevelActions, flip, 0.1);

    if(actionType === makeLambda) {
        //TODO generate Typesig
        return [makeLambda, [[['number', 'list'], 'number']]];
    }
    // takes a node from function set, binds to bindTo node as argument
    else if(actionType === addBoundNode) {
        var funcs = [];
        for(func in program.functions) {
            if(program.functions[func]['modifyable'] === true) {
                funcs.push(func);
            }
        }
        var parentFunc = getRandomElement(funcs, flip);
        var codeAsTree = program.functions[parentFunc]['codeAsTree'];
        // Recursively find all functions with empty slot (containing null)
        var viableParents = program.treeFilter(codeAsTree, function(funcTree, symbol) {
            var numArguments = funcTree[symbol].length;
            var hasEmptySlot = false;
            for(var i = 0; i < numArguments; ++i) {
                if(funcTree[symbol][i] === null) {
                    hasEmptySlot = true;
                    break;
                }
            }
            return hasEmptySlot;
        });

        if(viableParents.length === 0) {
            console.log("no empty slots");
            return [doNothing, []];
        }
        var parent = getRandomElement(viableParents, flip);

        // Get parent symbol
        // TODO: Fix:This will always select the first available slot of many
        var parentSymbol;
        var availableSlotPos;
        for(x in parent) {
            parentSymbol = x;
            for( availableSlotPos = 0; availableSlotPos < parent[parentSymbol].length; ++availableSlotPos) {
                if(parent[parentSymbol][availableSlotPos] === null) {
                    break;
                }
            }
        }
        // ViableChildrens should be list of functions or variables, which have output of given type or are of given type
        // Candidate list should be program.functions
        var requiredType = program.functions[parentSymbol]['typeSig'][0][availableSlotPos];

        var viableChildren = [];
        for(var func in program.functions) {
            if(program.functions[func]['typeSig'][1] === requiredType) {
                var tempObject = {};
                tempObject[func] = program.functions[func];
                viableChildren.push(tempObject);
            }
        }

        // TODO: Get variable children
        var localVariables = program.findLocalVariables(parentFunc);
        for(var variable in localVariables) {
            if(localVariables[variable]['typeSig'][0] === requiredType) {
                var tempObject = {};
                tempObject[variable] = localVariables[variable];
                viableChildren.push(tempObject);
            }
        }

        var child = getRandomElement(viableChildren, flip);
        return [addBoundNode, [child, parent, parentSymbol, availableSlotPos]];
    } else if(actionType === 'replace') {
        var viableFunctions = getConstrainedFunction(functionSet, function(lambda) {
            return (func.slotsAvailable > 0)
        });

    }
    // creates new function from subtree beginning at node,
    // match subtree in graph and replace subtree with function node,
    // add function node to set
    else if(actionType === 'lamdarise') {
    } else if(actionType === doNothing) {
        return [doNothing, []];
    } else {
        throw "Action " + actionType + " type not found";
    }
}

// var prog;
// window.onload = function() {
    // prog = new Program();
    // for(var i = 0; i < 30; ++i) {
        // $('#canvas').empty();
        // action = sampleAction(prog);
        // action[0].apply(prog, action[1]);
    // }
    // prog.draw();
// };
