## Table of Contents

- [Setup](#setup)
- [Add e1pagehelper Reference](#add-e1pagehelper-reference)
- [Add Adapter for E1 Page in index.html](#add-adapter-for-e1-page-in-indexhtml)
- [Create JdeServerAdapter Helper Function ](#create-jdeserveradapter-helper-function )
- [Calling an Orchestration](#calling-an-orchestration)
- [Setup for Local Testing](#setup-for-local-testing)
- [Upload to JDE](#upload-to-jde)
- [Mailing Address Update Interactive App](#mailing-address-update-interactive-app)
- [Cloning Repository](#cloning-repository)


### Setup

For instructions refer to the Setup section in the following repo:
[https://github.com/m-mattu/jde-react-app#setup](https://github.com/m-mattu/jde-react-app#setup)

### Add e1pagehelper Reference

We need to reference the JDE e1pagehelper JavaScript file which contains functions to call Orchestrator and AIS with the logged in user.
There are 2 different references we can add.
- Fully qualified
- Relative

The fully qualified reference is good if you just want to see what the page looks like in E1 without actually creating an E1 page. 
Example:
```html
	<script type="text/javascript" src="https://{your_jde_server}/jde/e1pages/e1pagehelper.js"></script>
```

The Relative reference is for when you are ready to create your E1 page.
This reference below says the e1pagehelper.js file is one directory above the current directory in which your app resides. This is how it looks like tools 9.2.1.7 atleast
Example:
```html
	<script type="text/javascript" src="../e1pagehelper.js"></script>
```

Adding the reference into your app:
1. In the public directory open the index.html file
2. Add the reference selected below the last meta tag

### Add Adapter for E1 Page in index.html

The adapter is required so the React App can communicate up to the JDE e1pagehelper functions. The JDE e1pagehelper allows the user who is logged in to call orchestration and other AIS Services.
You may add more adapters. Pretty much any function you want to call in the e1pagehelper file you just need to wrap in a function here

1. Open the index.html file in the following directory:
		Public/index.html
2. Above the <title> node in the index.html file enter the following code:
```html
  <script type="text/javascript">
    ///Adapter to call Orchestration
    function orchestrationService(orchestration,input,callback){
      window.callAISOrchestration(orchestration,input,callback)
    };

  </script>
```

### Create JdeServerAdapter Helper Function 
The helper adapter function will let us call JDE services with promises. It will also allow us to:
- create a mechanism that can be used for local testing
- Isolate all window calls to a single point
- use promises to handle responses

You can add any JDE Service to the below helper function like AIS, Data Service, etc. and handle the response in a similar manner.
The helper function will look like:
```js
const  JdeServiceAdapter  = {
	orchestrationService: (orchestration,input) =>{
		return  new  Promise((resolve, reject)=>{
			const  callback  = (response) => {
				if(typeof  response  ===  'string'){
					const  jsonResponse  =  JSON.parse(response);
					resolve(jsonResponse);
				}
				resolve(response);
			}
			window.runOrchestration(orchestration,input,callback);
		});
	}
}
```

### Calling an Orchestration

Now with promise returned we can execute an Orchestration like the following:
```js
JdeServiceAdapter.orchestrationService('InFocus_Update_AddressBook_MailingAddress',requestBody)
	.then((response)=>{
		//Insert Code to handle response here
	})
```

### Setup for Local Testing
To enable local testing we will look at the environment that the code is running in. When we run npm build the environment will be automatically set to production. With our JdeServiceAdapter Helper function we will add a switch case and execute according to the environment
```js
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
			///Switch case of the current procces environment. If not Production then define calls to AIS directly
			switch(process.env.NODE_ENV){
				case 'production':
					window.runOrchestration(orchestration,input,callback);
					break;
				default:
					///Add code for Local testing… Calling AIS Server directly
			}
		});
	}
}
```


###  Mailing Address Update Simple App
Refer to code here:


### Upload to JDE

So now lets bundle the app and upload to JDE:
1. In the terminal run the build command. Wait for the command to complete
```
npm run build
```
   Note: What this command does is bundles all of our files into 1 javascript file so when the page loads only 1 file must be loaded.    This is very useful especially when your app grows to many files.

2. We now have a new directory called build. This directory will contains our bundled app.
3. In the build directory change the name of the index.html file to home.html (This is how E1 wants the files)
4. Open the home.html file and replace all instances of "/static" to "static. The reference files cannot be found when the app loads in JDE when there is a "/" before the directory.
5. Select all the files and compress them into a zip file. It is recommended to use 7-zip as the default windows compression tool is known to have a bug in which E1 sometimes cannot uncompress the file
6. Open JDE E1
7. Navigate to creating a classic page
8. In the Page Type select Upload HTML Content
9. Click the Choose File button
10. Select the folder that we zipped in step 4
11. Click the Upload Button, Wait for the success message
12. Click the View Content button
Note: Our page loaded succesfully

###  Mailing Address Update Interactive App
Refer to code here:

There are a few things that have been added into this app:

- Global Loading Indicator (Can be used by any child component) 
		- Refer to: [https://medium.com/digio-australia/using-the-react-usecontext-hook-9f55461c4eae](https://medium.com/digio-australia/using-the-react-usecontext-hook-9f55461c4eae)
- Google Places Autocomplete component
		- Refer to: [https://www.npmjs.com/package/react-places-autocomplete](https://www.npmjs.com/package/react-places-autocomplete)
- Google Place Details API
		- Refer to: [https://developers.google.com/places/web-service/details](https://developers.google.com/places/web-service/details)

Google place details is used since react-places-autocomplete does not return the structured address object (address line1, city, postal code, etc). It will return the address in string format along with the Place ID.
You can choose to parse the string but there are a lot of cases to think about when it comes to locality. The method I went with is to use Google Place Details API to convert the Place ID into a structured address component.
For more details on how I did this look at the useGooglePlaceDetails file and the GoogleAddressSearch component. You will see when an address is selected in GoogleAddressSearch the useGooglePlaceDetails search function is executed.

### Cloning Repository

You can go ahead and clone this repo and build an app for your instance. Just remember the following must be performed for it to function:
1. Update the link in the index.html file so your JDE instance is referenced (for e1pagehelper)
2. Create an Orchestration in your instance and define it accordingly in the app
3. Optional You can import the Orchestration file (OrchestrationExport.zip) into your instance, but our instance has modified the app significantly for Health and Safety
