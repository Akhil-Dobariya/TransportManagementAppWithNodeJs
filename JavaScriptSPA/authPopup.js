// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new Msal.UserAgentApplication(msalConfig);

async function signIn() {
  console.log('Starting sign in--');
  //return new Promise(async function(resolve, reject) {
  await myMSALObj.loginPopup(loginRequest)
    .then(loginResponse => {
      console.log("id_token acquired at: " + new Date().toString());
      console.log(loginResponse);
      
      if (myMSALObj.getAccount()) {
        console.log(location.href);
        console.log('loggedin redirecting');
        console.log(sessionStorage);
        var optionss = location.href.split('?')[1];
        console.log(optionss);
        location.href='home?login=1';
        //location.href='home?'+options;
        //location.href='/?login=1';
        //document.cookie="LoggedIn=1;secure";
//         let xhr = new XMLHttpRequest();
// xhr.open("POST", location.href+'LoginAuthReq');
// xhr.setRequestHeader("Accept", "application/json");
// xhr.setRequestHeader("Content-Type", "application/json");

// xhr.onerror = function(err){
//   console.log(err);
// }
// xhr.onreadystatechange = function () {
//   if (xhr.readyState === 4) {
//     console.log(xhr.status);
//     console.log(xhr.responseText);

//     // let data = `{
//     //   IsLoggedIn=1
//     // }`;
    
//     // xhr.send(data);
//   }};

// let data = `{
//   IsLoggedIn=1
// }`;

// xhr.send(data);

      //   $.ajax({
      //     type: "POST",
      //     url: '/LoginAuthReq',
      //     data: {IsLoggedIn:1},
      //     dataType: "json",
      //     contentType: "application/json; charset=utf-8",
      //     success: function (data) {
      //        console.log(data);
      //     },
      //     error: function () {
      //         alert("Error while setting login session");
      //     }
      // });
      //resolve(true)
      //return true;
      }
    }).catch(error => {
      
      console.log(error);
      //resolve(false);
      //return false;
    });
    console.log('outofsigninin');
  //});
    
}

function signOut() {
  console.log('logging out');
  myMSALObj.logout();
  location.href='logout';
}

function getTokenPopup(request) {
  return myMSALObj.acquireTokenSilent(request)
    .catch(error => {
      console.log(error);
      console.log("silent token acquisition fails. acquiring token using popup");
          
      // fallback to interaction when silent call fails
        return myMSALObj.acquireTokenPopup(request)
          .then(tokenResponse => {
            return tokenResponse;
          }).catch(error => {
            console.log(error);
          });
    });
}

function seeProfile() {
  console.log('SeeProfile');
  console.log(myMSALObj);
  if (myMSALObj.getAccount()) {
    getTokenPopup(loginRequest)
      .then(response => {
        callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
      }).catch(error => {
        console.log(error);
      });
  }
}

function readMail() {
  if (myMSALObj.getAccount()) {
    getTokenPopup(tokenRequest)
      .then(response => {
        callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
      }).catch(error => {
        console.log(error);
      });
  }
}
