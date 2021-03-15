"use strict";
exports.__esModule = true;
exports.WorkloadType = exports.emptyWorkload = void 0;
exports.emptyWorkload = {
    name: '',
    type: '',
    createdAt: '',
    resourceVersion: '',
    istioSidecar: true,
    labels: {},
    appLabel: false,
    versionLabel: false,
    replicas: 0,
    availableReplicas: 0,
    pods: [],
    services: [],
    runtimes: [],
    additionalDetails: []
};
exports.WorkloadType = {
    CronJob: 'CronJob',
    DaemonSet: 'DaemonSet',
    Deployment: 'Deployment',
    DeploymentConfig: 'DeploymentConfig',
    Job: 'Job',
    Pod: 'Pod',
    ReplicaSet: 'ReplicaSet',
    ReplicationController: 'ReplicationController',
    StatefulSet: 'StatefulSet'
};
