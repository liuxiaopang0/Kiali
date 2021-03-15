"use strict";
exports.__esModule = true;
exports.drToIstioItems = exports.vsToIstioItems = exports.toIstioItems = exports.filterByConfigValidation = exports.filterByName = exports.dicIstioType = void 0;
exports.dicIstioType = {
    Sidecar: 'sidecars',
    Gateway: 'gateways',
    VirtualService: 'virtualservices',
    DestinationRule: 'destinationrules',
    ServiceEntry: 'serviceentries',
    AuthorizationPolicy: 'authorizationpolicies',
    PeerAuthentication: 'peerauthentications',
    RequestAuthentication: 'requestauthentications',
    WorkloadEntry: 'workloadentries',
    EnvoyFilter: 'envoyfilters',
    gateways: 'Gateway',
    virtualservices: 'VirtualService',
    destinationrules: 'DestinationRule',
    serviceentries: 'ServiceEntry',
    authorizationpolicies: 'AuthorizationPolicy',
    sidecars: 'Sidecar',
    peerauthentications: 'PeerAuthentication',
    requestauthentications: 'RequestAuthentication',
    workloadentries: 'WorkloadEntry',
    envoyfilters: 'EnvoyFilter',
    gateway: 'Gateway',
    virtualservice: 'VirtualService',
    destinationrule: 'DestinationRule',
    serviceentry: 'ServiceEntry',
    authorizationpolicy: 'AuthorizationPolicy',
    sidecar: 'Sidecar',
    peerauthentication: 'PeerAuthentication',
    requestauthentication: 'RequestAuthentication',
    workloadentry: 'WorkloadEntry',
    envoyfilter: 'EnvoyFilter'
};
var includeName = function (name, names) {
    for (var i = 0; i < names.length; i++) {
        if (name.includes(names[i])) {
            return true;
        }
    }
    return false;
};
var filterByName = function (unfiltered, names) {
    if (names && names.length === 0) {
        return unfiltered;
    }
    return {
        namespace: unfiltered.namespace,
        gateways: unfiltered.gateways.filter(function (gw) { return includeName(gw.metadata.name, names); }),
        virtualServices: {
            permissions: unfiltered.virtualServices.permissions,
            items: unfiltered.virtualServices.items.filter(function (vs) { return includeName(vs.metadata.name, names); })
        },
        destinationRules: {
            permissions: unfiltered.destinationRules.permissions,
            items: unfiltered.destinationRules.items.filter(function (dr) { return includeName(dr.metadata.name, names); })
        },
        serviceEntries: unfiltered.serviceEntries.filter(function (se) { return includeName(se.metadata.name, names); }),
        authorizationPolicies: unfiltered.authorizationPolicies.filter(function (rc) { return includeName(rc.metadata.name, names); }),
        sidecars: unfiltered.sidecars.filter(function (sc) { return includeName(sc.metadata.name, names); }),
        peerAuthentications: unfiltered.peerAuthentications.filter(function (pa) { return includeName(pa.metadata.name, names); }),
        requestAuthentications: unfiltered.requestAuthentications.filter(function (ra) { return includeName(ra.metadata.name, names); }),
        workloadEntries: unfiltered.workloadEntries.filter(function (we) { return includeName(we.metadata.name, names); }),
        envoyFilters: unfiltered.envoyFilters.filter(function (ef) { return includeName(ef.metadata.name, names); }),
        validations: unfiltered.validations,
        permissions: unfiltered.permissions
    };
};
exports.filterByName = filterByName;
var filterByConfigValidation = function (unfiltered, configFilters) {
    if (configFilters && configFilters.length === 0) {
        return unfiltered;
    }
    var filtered = [];
    var filterByValid = configFilters.indexOf('Valid') > -1;
    var filterByNotValid = configFilters.indexOf('Not Valid') > -1;
    var filterByNotValidated = configFilters.indexOf('Not Validated') > -1;
    var filterByWarning = configFilters.indexOf('Warning') > -1;
    if (filterByValid && filterByNotValid && filterByNotValidated && filterByWarning) {
        return unfiltered;
    }
    unfiltered.forEach(function (item) {
        if (filterByValid && item.validation && item.validation.valid) {
            filtered.push(item);
        }
        if (filterByNotValid && item.validation && !item.validation.valid) {
            filtered.push(item);
        }
        if (filterByNotValidated && !item.validation) {
            filtered.push(item);
        }
        if (filterByWarning && item.validation && item.validation.checks.filter(function (i) { return i.severity === 'warning'; }).length > 0) {
            filtered.push(item);
        }
    });
    return filtered;
};
exports.filterByConfigValidation = filterByConfigValidation;
var toIstioItems = function (istioConfigList) {
    var istioItems = [];
    var hasValidations = function (type, name) {
        return istioConfigList.validations[type] && istioConfigList.validations[type][name];
    };
    var nonItems = ['validations', 'permissions', 'namespace'];
    Object.keys(istioConfigList).forEach(function (field) {
        if (nonItems.indexOf(field) > -1) {
            // These items do not belong to the IstioConfigItem[]
            return;
        }
        var typeNameProto = exports.dicIstioType[field.toLowerCase()]; // ex. serviceEntries -> ServiceEntry
        var typeName = typeNameProto.toLowerCase(); // ex. ServiceEntry -> serviceentry
        var entryName = typeNameProto.charAt(0).toLowerCase() + typeNameProto.slice(1);
        var entries = istioConfigList[field];
        if (!(entries instanceof Array)) {
            // VirtualServices, DestinationRules
            entries = entries.items;
        }
        entries.forEach(function (entry) {
            var item = {
                namespace: istioConfigList.namespace.name,
                type: typeName,
                name: entry.metadata.name,
                creationTimestamp: entry.metadata.creationTimestamp,
                resourceVersion: entry.metadata.resourceVersion,
                validation: hasValidations(typeName, entry.metadata.name)
                    ? istioConfigList.validations[typeName][entry.metadata.name]
                    : undefined
            };
            item[entryName] = entry;
            istioItems.push(item);
        });
    });
    return istioItems;
};
exports.toIstioItems = toIstioItems;
var vsToIstioItems = function (vss, validations) {
    var istioItems = [];
    var hasValidations = function (name) { return validations.virtualservice && validations.virtualservice[name]; };
    var typeNameProto = exports.dicIstioType['virtualservices']; // ex. serviceEntries -> ServiceEntry
    var typeName = typeNameProto.toLowerCase(); // ex. ServiceEntry -> serviceentry
    var entryName = typeNameProto.charAt(0).toLowerCase() + typeNameProto.slice(1);
    vss.forEach(function (vs) {
        var item = {
            namespace: vs.metadata.namespace || '',
            type: typeName,
            name: vs.metadata.name,
            creationTimestamp: vs.metadata.creationTimestamp,
            resourceVersion: vs.metadata.resourceVersion,
            validation: hasValidations(vs.metadata.name) ? validations.virtualservice[vs.metadata.name] : undefined
        };
        item[entryName] = vs;
        istioItems.push(item);
    });
    return istioItems;
};
exports.vsToIstioItems = vsToIstioItems;
var drToIstioItems = function (drs, validations) {
    var istioItems = [];
    var hasValidations = function (name) { return validations.destinationrule && validations.destinationrule[name]; };
    var typeNameProto = exports.dicIstioType['destinationrules']; // ex. serviceEntries -> ServiceEntry
    var typeName = typeNameProto.toLowerCase(); // ex. ServiceEntry -> serviceentry
    var entryName = typeNameProto.charAt(0).toLowerCase() + typeNameProto.slice(1);
    drs.forEach(function (dr) {
        var item = {
            namespace: dr.metadata.namespace || '',
            type: typeName,
            name: dr.metadata.name,
            creationTimestamp: dr.metadata.creationTimestamp,
            resourceVersion: dr.metadata.resourceVersion,
            validation: hasValidations(dr.metadata.name) ? validations.destinationrule[dr.metadata.name] : undefined
        };
        item[entryName] = dr;
        istioItems.push(item);
    });
    return istioItems;
};
exports.drToIstioItems = drToIstioItems;
