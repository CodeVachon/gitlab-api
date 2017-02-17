# gitlab-ce-api
A node module for connecting to and getting data from gitlab 8

## Notes
1. this is very much a work in progress.  I will only be updating it as I need to.
2. Token refers to `Access Tokens`.  They can be generated from here: `[gitlaburl]/profile/personal_access_tokens`
3. Requires GitLab CE version 8.13+


## Install
```sh
npm install gitlab-ce-api --save
```

## Init
```js
var gitlabAPI = require('gitlab-ce-api');

var options = {
    token: "",
    baseURL: "",
    port: 80,
    timeout: 15000,
    https: true,
    verbose: false
};

gitlabAPI(options);
```

## Options
- `token`: The User to sign into the registry with
- `baseURL`: The URL for the registry.  eg: `hub.docker.com`
- `port`: The Port Number to connect to. Default: `80`
- `timeout`: Timeout value in milliseconds. Default `15000`
- `https`: Use HTTPS to connect to the API. Default `true`,
- `verbose`: Log console actions taken (for debugging). Default `false`

each option has a `get` and `set` method in camel case (`gitlabAPI(options).setVerbose(true)`).

## Usage
### List of Projects
```js
gitlabAPI(options).projects().then(function(projects) {
    console.log(projects);
}).catch(function(error) {
    console.error(error);
});
```

### Projects Details
```js
var ProjectId = 123;
gitlabAPI(options).projects(ProjectId).then(function(project) {
    console.log(project);
}).catch(function(error) {
    console.error(error);
});
```

### Projects Repository File Tree
```js
var ProjectId = 123;
gitlabAPI(options).repository(ProjectId, {
    path: "", // navigate deeper into file tree
    ref_name: "master", // branch
    recursive: true // enterprise only
}).then(function(fileTree) {
    console.log(fileTree);
}).catch(function(error) {
    console.error(error);
});
```

### Project Repository File Details
```js
var ProjectId = 123;
gitlabAPI(options).repositoryFile(ProjectId, {
    file_path: "", // path to file
    ref: "master" // branch
}).then(function(file) {
    console.log(file);
}).catch(function(error) {
    console.error(error);
});
```
