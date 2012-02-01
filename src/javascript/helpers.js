// Assorment of helper functions

// Sum values in array
var sum = function(arrayToSum) {
    return arrayToSum.reduce(function(previousValue, currentValue, index, array) {
        return previousValue + currentValue;
    });

}

// Min value in array
var min = function(arrayToMin) {
    return Math.min.apply(Math.min, arrayToMin);
}

// Use exp(probabilities)
var weightedExpSample = function(weightedArray) {
    var expArray = weightedArray.map(function(weight, index) {
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
        return sum(weightedArray.slice(0, index + 1));
    });

    var randReal = Math.random() * totalReward;
    var randIndex = 0;
    for(var i = 0; i < indexedArray.length; ++i) {
        if(randReal <= indexedArray[i]) {
            return i;
        }
    }
    throw "Return not reached as index not found"
}

// Are arrays a and b equal? (required because [1,2] != [1,2] in js)
function arraysEqual(a, b) {
    return !(a < b || b < a);
};

// Picks a random property from an object
var pickRandomProperty = function(obj) {
    var result, count = 0;
    for(var prop in obj) {
        if(Math.random() < 1 / ++count) {
            result = prop;
        }
    }
    return result;
};

// Returns nested object from parent and list of properties (i.e. strack trace)
// e.g. parentObj = {a:{b:{c:true}}}, propertyStack = [a,b,c], returns true
var getNestedObjectFromPropertyStack = function(parentObj, propertyStack) {
    var nestedObj = parentObj;
    for(var i = 0; i < propertyStack.length; i++) {
        nestedObj = nestedObj[propertyStack[i]];
    }
    return nestedObj;
};

// Elementary random primitices
var flip = function() {
    return;
};

var randInteger = function(lowerBound, upperBound) {
    return Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
};

// TODO - make this do as intended
var getRandomElement = function(list, erp, erpParams) {
    return list[randInteger(0, list.length)];
};

// for(var i = 0; i < makeStateful(gaussian)(depth); ++i) {
//
// }

// Turn a normal ERP into a stateful one
var makeErpStateful = function(erp, erpType) {
    return function() {
        var erpParams = Array.prototype.slice.call(arguments);
        var currentParams = {
            type : erpType,
            params : erpParams
        };
        var name = ii;
        ii += 1;
        if( name in database && currentParams.type == database[name].type) {
            var dbParams = database[name];
            if(arraysEqual(currentParams.theta, dbParams.theta)) {
                return dbParams['value'];
            }
            else {
                var l = Math.log(computeLikelihood());
                database.name.l = l;
                logLikelihood = logLikelihood + l;
            }
        }
        else {
            var sampledValue = erp.apply(erp, erpParams);
            database[name] = {
                type : erpType,
                value : sampledValue,
                params : erpParams
            };
            return sampledValue;
        }
    }

}

//If we revert to parent
var ii = 0;

var stUnif = function() {
    var theta = Array.prototype.slice.call(arguments);
    var currentParams = {
        type : 'unif',
        theta : theta
    };
    var name = ii;
    ii += 1;
    if( name in database && currentParams.type == database[name].type) {
        var dbParams = database[name];
        if(arraysEqual(currentParams.theta, dbParams.theta)) {
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
};

var stRandInteger = function(lowerBound, upperBound) {
    return Math.floor(stUnif() * (upperBound - lowerBound)) + lowerBound;
};

// TODO - make this do as intended
var stGetRandomElement = function(list) {
    return list[stRandInteger(0, list.length)];
};

var stGetRandomFilteredElementIndex = function(list, filterFunc) {
    var tempList = [];
    for(var i = 0; i < list.length; ++i) {
        if(filterFunc(list[i]) === true) {
            tempList.push(i);
        }
    }
    return stGetRandomElement(tempList);
};

var indexInListOfArrays = function(list, searchValue) {
    var index = -1;
    for(var i = 0; i < list.length; ++i) {
        if(arraysEqual(list[i], searchValue)) {
            index = i;
            break;
        }
    }
    return index;
};

var poissionRnd = function(lambda) {
    var L = Math.exp(-lambda);
    var k = 0;
    var p = 1;
    do {
        k = k + 1;
        p = p * Math.random();
    } while (p > L);
    return k - 1;
}

var getProposal = function(erpType) {
    var typeToProposal = {
        unif : function() {
            return Math.random();
        }

    }
    if( erpType in typeToProposal) {
        return typeToProposal[erpType];
    }
    else {
        throw "erpTypeHasNoProposal";
    }
};

var totalAccepted = 0;
var totalRejected = 0;
var database = {};
var totalBetter = 0, totalTotal = 0;
// a = makeErpStateful(poissionRnd, "poissonRnd")
// a(3);
// a(3);
