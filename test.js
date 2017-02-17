var GitLabAPI = require('./module')({
    token: "",
    baseURL: "",
    port: 80,
    timeout: 15000,
    https: true,
    verbose: true
});

var ProjectID = null;


GitLabAPI.version().then(function(version) {
    console.log(version);
    return GitLabAPI.projects();
}).then(function(projects) {
    console.log(projects);
    ProjectID = projects[0].path_with_namespace;
    console.log("Ask for Details On ProjectID: " + ProjectID);
    return GitLabAPI.projects(ProjectID)
}).then(function(project) {
    console.log(project);
    return GitLabAPI.repository(ProjectID)
}).then(function(fileTree) {
    console.log(fileTree);

    var Filename = null;
    fileTree.forEach(function(item) {
        if (item.type == "blob") {
            Filename = item.name;
        }
    });

    console.log("Ask for File: " + Filename);

    return GitLabAPI.repositoryFile(ProjectID, {
        file_path: Filename
    })
}).then(function(file) {
    console.log(file);

    var base64 = require('base64-min');
    console.log(base64.decode(file.content));
}).catch(function(error) {
    console.error(error);
})
