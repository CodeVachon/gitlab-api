var got = require('got');
var extend = require('extend');

module.exports = function gitLabAPI(options) {
    var _this = this;

    var _settings = extend(false, {
        token: "",
        baseURL: "",
        port: 80,
        timeout: 15000,
        https: true,
        verbose: false
    }, options);

    _this.callAPI = function(path, queryObject, method) {
        var fullURL = `http${(_settings.https)?"s":""}://${_settings.baseURL}${(_settings.port != 80)?`:${_settings.port}`:""}/api/v3/${path}`;

        _this.log(`Send Request to [${fullURL}] with Token [${_settings.token}]`);

        return got(fullURL, {
            headers: { "PRIVATE-TOKEN": `${_settings.token}` },
            method: method || "GET",
            query: queryObject,
            json: true,
            timeout: _settings.timeout
        }).then(function(response) {
            _this.log(`Request [${fullURL}] Completed with [${response.statusCode}]`);
            return response;
        }).catch(function(error) {
            _this.log(`Request [${fullURL}] Failed with [${error.statusCode}]: ${error.message}`);
            throw error;
        }); // close return got
    } // close callAPI
    _this.log = function(message) {
        if (_settings.verbose) {
            console.log(`-- ${message}`);
        }
    } // close _this.log

    _this.set = function(key, value) { _settings[key] = value; }
    _this.get = function(key) { return _settings[key]; }

    var returnedMethods = {
        version: function() {
            return new Promise(function(resolve, reject) {
                _this.callAPI("version").then(function(response) {
                    return resolve(response.body);
                }).catch(reject);
            });
        },
        projects: function(projectId) {
            if (projectId) {
                return new Promise(function(resolve, reject) {
                    _this.callAPI("projects/" + projectId, {
                        simple: true,
                        order_by: "name"
                    }).then(function(response) {
                        return resolve(response.body);
                    }).catch(reject);
                });
            } else {
                return new Promise(function(resolve, reject) {
                    _this.callAPI("projects", {
                        simple: true,
                        order_by: "name"
                    }).then(function(response) {
                        return resolve(response.body);
                    }).catch(reject);
                });
            }
        },
        repository: function(projectId, options) {
            return new Promise(function(resolve, reject) {
                _this.callAPI("projects/" + projectId + "/repository/tree", extend(false, {
                    path: "",
                    ref_name: "master",
                    recursive: true
                }, options)).then(function(response) {
                    return resolve(response.body);
                }).catch(reject);
            });
        },
        repositoryFile: function(projectId, options) {
            return new Promise(function(resolve, reject) {
                _this.callAPI("projects/" + projectId + "/repository/files", extend(false, {
                    file_path: "",
                    ref: "master"
                }, options)).then(function(response) {
                    return resolve(response.body);
                }).catch(reject);
            });
        }
    }; // close returnedMethods

    Object.keys(_settings).forEach( key => {
        var capitalizedKey = key.charAt(0).toUpperCase() + key.substr(1);
        returnedMethods[ `get${capitalizedKey}` ] = function() {
            _this.log(`Get value for [${capitalizedKey}]`);
            return _this.get(key)
        };
        returnedMethods[ `set${capitalizedKey}` ] = function(value) {
            _this.log(`Set value for [${capitalizedKey}] to [${value}]`);
            return _this.set(key, value)
        };
    });

    return returnedMethods;
}; // close gitLabAPI
