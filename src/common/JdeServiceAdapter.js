import { resolve } from 'q';
//Enter your local ais server
const server = ""
const JdeServiceAdapter = {
    orchestrationService: (orchestration,input) =>{
        return new Promise((resolve, reject)=>{
            const callback = (response) => {
                if(typeof response === 'string'){
                    let jsonResponse = JSON.parse(response);
                    resolve(jsonResponse);
                }
                resolve(response);
            }
            ///Switch case of the current procces environment. If not Production then use the ais proxy service
            switch(process.env.NODE_ENV){
                case 'production':
                    window.runOrchestration(orchestration,input,callback);
                    break;
                default:
                //All code below is for local Testing Environment
                let requestBody = input;
                if(input !== ""){
                    requestBody.username = "";
                    requestBody.password = ""
                }
                
                let requestUrl =  `${server}/orchestrator/${orchestration}`;
                fetch(requestUrl,{
                    method: 'POST',
                    headers:{
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                    })
                    .then(res => res.json())
                    .then(
                      (result) => { resolve(result)},
                      (error) => {
                        reject(error)
                      }
                    )
            }
        });
        
    },
    runJdeApp: (appId, formId, version,formDSTmpl, formDSData) => {
        switch(process.env.NODE_ENV){
            case 'production':
                window.runJdeE1App(appId, formId, version, "", "", formDSTmpl, formDSData);
                break;
            default:
                //Used for testing Environment
            }
    },
    getUserInfo: () => {
        switch(process.env.NODE_ENV){
            case 'production':
                let user = window.getUserInfo();
                return user;
            default:
                return {
                    userName: 'Name',
                    UserId: 'USER'
                }
            }
    }
}
    export default JdeServiceAdapter;

