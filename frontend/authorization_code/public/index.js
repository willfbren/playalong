const API_DOMAIN = "http://localhost:3000/cable";

let api = WarpCable(API_DOMAIN);

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

let params = getHashParams();
if (params.access_token == undefined) {
  window.location.replace("/login");
}
let spotify_api = new SpotifyWebApi();
spotify_api.setAccessToken(params.access_token);

let test = document.createElement("h1");
test.innerText = "PlayAlong Playlist";
document.body.append(test);
let searchForm = document.createElement("form");
let input = document.createElement("input");
searchForm.setAttribute("class", "song-search");
input.setAttribute("id", "song-title");
input.setAttribute("type", "text");
input.setAttribute("placeholder", "Search for a song");
searchForm.append(input);
let button = document.createElement("button");
button.innerText = "Search";
document.body.append(searchForm);
searchForm.appendChild(button);

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  async function searchSpotify() {
    let query = input.value;
    // let types = ["album", "artist", "playlist", "track"];
    const results = await spotify_api.searchTracks(query);

    // const searchItems = results.tracks.items;
    let displayResult = document.createElement("ul");
    document.body.append(displayResult);
    results.tracks.items.forEach((tracks) => {
      let uri = tracks.uri;
      let title = tracks.name;
      tracks.artists.forEach((artist) => {
        let artistName = artist.name;
        let songOption = document.createElement("li");
        songOption.innerText = `${title} - ${artistName}`;
        displayResult.appendChild(songOption);
        songOption.addEventListener("click", function (e) {
          console.log(songOption, uri);
          selectedTrack(uri);
          let songQueue = document.getElementById("song-queue");
          songQueue.appendChild(songOption);

          displayResult.remove();
        });
      });
    });
    function selectedTrack(uri) {
      fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${uri}&device_id=ab5854b8d6d635ec4266f2f1e23aaf188df9dec6`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer  ${params.access_token}`,
          },
          body: JSON.stringify({
            uri: uri,
          }),
        }
      );
    }
  }
  searchSpotify();
});

function addToQueue(songUri) {
  fetch(`http://localhost:3000/playlists/addToQueue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      uri: songUri,
    }),
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (song) {
      //what do we do here?
    });
}

// const currentUser = async () => {
//   // setting await spotify_api.getMe() to variable
//   let currentUser = await spotify_api.getMe();

//   let userInfo = {
//     name: currentUser.display_name,
//     email: currentUser.email,
//     spotify_id: currentUser.id,
//   };

//   // call to api to set current user
//   api.trigger("Users", "set_user", userInfo, function (currentUser) {
//     let loggedIn = document.createElement("p");
//     loggedIn.innerText = `Logged in as: ${currentUser.name}`;
//     document.body.append(loggedIn);
//   });
// };

// currentUser();

// create an input for the search
// take value from the input
// make call to function
