(() => {
    let scripts = document.getElementsByTagName("script");
    let src = scripts[scripts.length-1].src;
    let path = src.replace('/initialization/libraries.js', '');

    window.loadLibraries = (libraries, callback) => {
        let loadedCounter = libraries.length;

        libraries.forEach(library => {
            let scriptTag = document.createElement('script');
            scriptTag.src = library;
            document.head.appendChild(scriptTag);

            scriptTag.onload = () => {
                loadedCounter -= 1;

                if (loadedCounter == 0) {
                    callback();
                }
            };
        });
    };

    window.loadInternalLibraries = (callback) => {
        let libraries = [
            `${path}/libraries/azure-devops-backlogs.js`,
            `${path}/libraries/azure-devops-iterations.js`,
            `${path}/libraries/azure-devops-teams.js`,
            `${path}/libraries/azure-devops-queries.js`,
            `${path}/libraries/azure-devops-teams.js`,
            `${path}/libraries/azure-devops-work-items.js`,
            `${path}/libraries/azure-devops-work-item-types.js`
        ];

        loadLibraries(libraries, callback);
    };

    window.loadAzureDevOpsServices = (callback) => {
        VSS.require([
            'TFS/Work/RestClient',
            'VSS/Service', 
            'TFS/WorkItemTracking/RestClient',
            'TFS/Core/RestClient'
        ], (
            TFSWorkRestClient,
            VSSService, 
            TFSWorkItemTrackingRestClient,
            TFSCoreRestClient
        ) => {
            window.AzureDevOpsServices = {
                tfsWebAPIClient: TFSWorkRestClient?.getClient(),
                witClient: VSSService?.getCollectionClient(TFSWorkItemTrackingRestClient.WorkItemTrackingHttpClient),
                witRestClient: TFSWorkItemTrackingRestClient.getClient(),
                tfsCoreRestClient: TFSCoreRestClient.getClient()
            };            

            callback();
        });        
    };    
})();