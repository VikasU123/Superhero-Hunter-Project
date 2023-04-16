
// public key:- fa8270b19dc3e883ca4f378b4db450c4
// private key:- 43359669ee80b4f52965f957089d685fa7b64b07
// MD5:- 2f9cc1b9ed01ec54e50814ec00fca9f0
// url:- http://gateway.marvel.com/v1/public/characters?ts=1&apikey=fa8270b19dc3e883ca4f378b4db450c4&hash=2f9cc1b9ed01ec54e50814ec00fca9f0 


//*-------------------------------------- Selecting the element from DOM ----------------------------------------------------
// Input element in search bar
let searchBar = document.getElementById("inputName");
// list of searched superheros div
let searchResults = document.getElementById("search-results");


// Getting the searched string from the search bar and getting the list of super hero objects through HTTP request from morval website
document.getElementById("search-form").addEventListener('keyup', function(){
     var url = geturl();
     // creating HTTP request object
     var xhrRequest = new XMLHttpRequest();
     xhrRequest.open('get', url, true);
     xhrRequest.send();
     xhrRequest.onload = function(){
          var data = JSON.parse(xhrRequest.responseText);
          showSearchedResults(data.data.results);
     }
});

// returning the url based on search query
function geturl(){
     var searchQuery = searchBar.value;
     console.log(searchQuery);
     
     if(!searchQuery){
          return `http://gateway.marvel.com/v1/public/characters?ts=1&apikey=fa8270b19dc3e883ca4f378b4db450c4&hash=2f9cc1b9ed01ec54e50814ec00fca9f0`;
     }else{
          return `https://gateway.marvel.com/v1/public/characters?ts=1&nameStartsWith=${searchQuery}&apikey=fa8270b19dc3e883ca4f378b4db450c4&hash=2f9cc1b9ed01ec54e50814ec00fca9f0`;
     }
}

// Function for displaying the searched results in DOM
// An array is accepted as argument 
// SearchedHero is the array of objects which matches the string entered in the searched bar
function showSearchedResults(results) {
     console.log(results);
     searchResults.innerHTML = '';

     // IDs of the character which are added in the favourites 
     // Used for displaying the appropriate button in search results i.e
     // if the id exist in this array then we display "Remove from favourites" button otherwise we display "Add to favourites button"
     // favouritesCharacterIDs is a map which contains id of character as key and true as value 
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if(favouritesCharacterIDs == null){
          // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
          favouritesCharacterIDs = new Map();
     }
     else if(favouritesCharacterIDs != null){
          // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }


     // if super hero is not present on the search quary then it will show alert message
     if(!results){
          window.alert("No Superhero found!");
     }else{
          // iterating the searchedHero array using for and getting all the elements that are similar to the search quary
          for(let result of results){

               // Appending the element into DOM
               searchResults.innerHTML +=
                    `
                    <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img src="${result.thumbnail.path+'/portrait_xlarge.'+ result.thumbnail.extension}" alt="">
                    </div>
   
                    <div class="hero-info">
                         <a class="character-info" href="./detial.html">
                             <span class="hero-name">${result.name}</span>
                         </a>
                    </div>
   
                    <div class="flex-col buttons">
                    <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${result.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                    </div>
   
                    <div style="display:none;">
                         <span>${result.name}</span>
                         <span>${result.description}</span>
                         <span>${result.comics.available}</span>
                         <span>${result.series.available}</span>
                         <span>${result.stories.available}</span>
                         <span>${result.thumbnail.path+'/portrait_uncanny.' + result.thumbnail.extension}</span>
                         <span>${result.id}</span>
                         <span>${result.thumbnail.path+'/landscape_incredible.' + result.thumbnail.extension}</span>
                         <span>${result.thumbnail.path+'/standard_fantastic.' + result.thumbnail.extension}</span>
                    </div>
               </li>
               `
          }
          // Adding the appropritate events to the buttons after they are inserted in dom
          events();
     }
}


// Function for attacthing eventListener to buttons
function events() {
     
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}

// Function invoked when "Add to Favourites" button or "Remvove from favourites" button is click appropriate action is taken accoring to the button clicked
function addToFavourites() {

     // If add to favourites button is cliked then
     if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {

          // We cretate a new object containg revelent info of hero and push it into favouritesArray
          let heroInfo = {
               name: this.parentElement.parentElement.children[3].children[0].innerHTML,
               description: this.parentElement.parentElement.children[3].children[1].innerHTML,
               comics: this.parentElement.parentElement.children[3].children[2].innerHTML,
               series: this.parentElement.parentElement.children[3].children[3].innerHTML,
               stories: this.parentElement.parentElement.children[3].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.children[3].children[5].innerHTML,
               id: this.parentElement.parentElement.children[3].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.children[3].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.children[3].children[8].innerHTML
          }

          // getting the favourites array which stores objects of character  
          // We get null is no such array is created earlier i.e user is running the website for the first time
          let favouritesArray = localStorage.getItem("favouriteCharacters");

          // If favouritesArray is null (for the first time favourites array is null)
          if (favouritesArray == null) {
               // favourites array is null so we create a new array
               favouritesArray = [];
          } else {
               // if it is not null then we parse so that it becomes an array 
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }

          // favouritesCharacterIDs is taken from localStorage for adding ID of the character which is added in favourites
          // It is created because when we search for the characters which is already added in favourites we check that if the id of the character exist in this array then we display "Remove form favourites" insted of "Add to favourites"
          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

          
          if (favouritesCharacterIDs == null) {
          // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
               favouritesCharacterIDs = new Map();
          } else {
               // getting the map as object from localStorage and pasrsing it and then converting into map 
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
               // favouritesCharacterIDs = new Map(Object.entries(favouritesCharacterIDs));
          }

          // again setting the new favouritesCharacterIDs array to localStorage
          favouritesCharacterIDs.set(heroInfo.id, true);
          // console.log(favouritesCharacterIDs)

          // adding the above created heroInfo object to favouritesArray
          favouritesArray.push(heroInfo);

          // Storing the new favouritesCharactersID map to localStorage after converting to string
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          // Setting the new favouritesCharacters array which now has the new character 
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

          // Convering the "Add to Favourites" button to "Remove from Favourites"
          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
          
          // Displaying the "Added to Favourites" toast to DOM
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
          // Deleting the "Added to Favourites" toast from DOM after 1 seconds
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
     }
     // For removing the character form favourites array
     else{
          
          // storing the id of character in a variable 
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[3].children[6].innerHTML;
          
          // getting the favourites array from localStorage for removing the character object which is to be removed
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          
          // getting the favaourites character ids array for deleting the character id from favouritesCharacterIDs also
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          
          // will contain the characters which should be present after the deletion of the character to be removed 
          let newFavouritesArray = [];
          // let newFavouritesCharacterIDs = [];
          
          // deleting the character from map using delete function where id of character acts as key
          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
          
          // creating the new array which does not include the deleted character
          // iterating each element of array
          favouritesArray.forEach((favourite) => {
               // if the id of the character doesn't matches the favourite (i.e a favourite character) then we append it in newFavourites array 
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               }
          });
          
          // console.log(newFavouritesArray)
          
          // Updating the new array in localStorage
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          
          
          // Convering the "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
          
          // Displaying the "Remove from Favourites" toast to DOM
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
          // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000);
          // console.log();
     }     
}

// Function which stores the info object of character for which user want to see the info 
function addInfoInLocalStorage() {

     // This function basically stores the data of character in localStorage.
     // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data  
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[3].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[3].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[3].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[3].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[3].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[3].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[3].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[3].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[3].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
