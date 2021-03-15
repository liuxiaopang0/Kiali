"use strict";
exports.__esModule = true;
exports.EmptyExperimentSpec = exports.initCriteria = exports.emptyExperimentDetailsInfo = exports.emptyExperimentItem = void 0;
exports.emptyExperimentItem = {
    name: '',
    phase: '',
    targetService: '',
    targetServiceNamespace: '',
    status: '',
    baseline: {
        name: '',
        version: '',
        weight: 0,
        winProbability: 0,
        requestCount: 0
    },
    candidates: [],
    namespace: '',
    initTime: '',
    startTime: '',
    endTime: '',
    winner: {
        name: '',
        winning_version_found: false,
        current_best_version: '',
        probability_of_winning_for_best_version: 0
    },
    experimentKind: 'Canary',
    kind: 'Deployment'
};
exports.emptyExperimentDetailsInfo = {
    experimentItem: exports.emptyExperimentItem,
    criterias: [],
    trafficControl: {
        strategy: 'check_and_increment',
        maxIncrement: 2,
        onTermination: 'to_winner',
        match: {
            http: []
        }
    },
    duration: {
        interval: '30s',
        intervalInSecond: 30,
        maxIterations: 100
    },
    networking: {
        id: '',
        hosts: []
    },
    permissions: {
        create: true,
        update: true,
        "delete": true
    },
    experimentType: 'C'
};
var initCriteria = function () { return ({
    metric: '',
    tolerance: 200,
    toleranceType: 'absolute',
    stopOnFailure: false,
    isReward: false
}); };
exports.initCriteria = initCriteria;
exports.EmptyExperimentSpec = {
    name: '',
    namespace: 'default',
    apiversion: 'v1',
    service: '',
    baseline: '',
    candidate: [],
    trafficControl: {
        algorithm: 'progressive',
        maxIncrement: 10
    },
    duration: {
        interval: '30s',
        intervalInSecond: 30,
        maxIterations: 10
    },
    criterias: [],
    hosts: [],
    experimentKind: 'Deployment'
};
