
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, set, onValue, } from  "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import * as main from "./main.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfUELAoqrdMGZPHQYvVp24BY7e-Wg3d5Q",
    authDomain: "taskmanager-68a82.firebaseapp.com",
    databaseURL: "https://taskmanager-68a82-default-rtdb.firebaseio.com",
    projectId: "taskmanager-68a82",
    storageBucket: "taskmanager-68a82.appspot.com",
    messagingSenderId: "1000914663453",
    appId: "1:1000914663453:web:bc532804ebfe3c5890aef4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();




//function that server will use to write data
const writeUserData = (title,description,dueDate,username)=>{
    //grab our username
    const userDir = ref(db, `users/${username}/${title}`);
    //set the data where that jimmy jawn belong
    set(userDir,{
        title:title,
        description:description,
        dueDate:dueDate,
    });
    console.log(`userDir:${userDir}`);
}

//function that will handle setting up our community page another helper function
function loadScreen(username)
{
    
    const usersDirForLinker = ref(db,`users/${username}`);
    
    //set up our onvalue 
    onValue(usersDirForLinker,likesUpdatedLoadCommunity);

    //make sure we actually get data prepared to be returned to main
    function likesUpdatedLoadCommunity(snapshot)
    {
        let cards=[];
       // console.log(snapshot.val());
        snapshot.forEach(card => {
            const childKey = card.val();
            main.sendPostFromFireBase(childKey);
            //console.log(childKey);
            cards.push(childKey);
          });
          
          //now create the cards

    }
    
    
 
}
/*
var query = ref(db, `users/`).orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      console.log("key");
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
  });
});
*/
//helper function for write userData
const parseUser=(username)=>{
    //create db dir
    const userDir = ref(db, `${username}/`);
    return userDir;
}
//test function for linkage
const displayApp = () => {
    console.log(app);
}

export{displayApp,writeUserData,loadScreen};
