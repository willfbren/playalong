let currentUser = "";

let device = "";

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

window.history.pushState({ path: "/" }, "home", "/");

fetch("https://api.spotify.com/v1/me/player/devices", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${params.access_token}`,
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (resp) {
    if (resp.error) {
      window.location.replace("/login");
    }
    device = resp.devices[0].id;
    console.log(device);
  });

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

async function searchSpotify() {
  let query = input.value;
  // let types = ["album", "artist", "playlist", "track"];
  const results = await spotify_api.searchTracks(query);

  // const searchItems = results.tracks.items;
  let displayResult = document.createElement("ul");
  document.body.append(displayResult);
  results.tracks.items.forEach((track) => {
    let uri = track.uri;
    let title = track.name;

    track.artists.forEach((artist) => {
      // console.log(artist);
      let artistName = artist.name;
      let songOption = document.createElement("li");
      songOption.innerText = `${title} - ${artistName}`;
      displayResult.appendChild(songOption);
      songOption.addEventListener("click", function () {
        console.log(songOption, uri, track);
        let ulSong = document.getElementById("song-queue");
        ulSong.innerHTML = "";
        selectedTrack(uri, track);
        displayResult.remove();
      });
    });
  });
}
liveQueue();
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  searchSpotify();
});

function selectedTrack(uri, track) {
  api.trigger("Songs", "create", {
    title: track.name,
    artist: track.artists[0].name,
    uri: uri,
  });

  console.log(device);
}

function liveQueue() {
  api.subscribe("Songs", "index", {}, function (songs) {
    console.log(songs);
    songs.forEach((song) => {
      let newSongOption = document.createElement("li");
      newSongOption.likes = 0;
      newSongOption.likes.id = "likes-song";
      newSongOption.innerText = `${song.title} - ${song.artist}`;
      let songQueue = document.getElementById("song-queue");
      songQueue.appendChild(newSongOption);
      btnDelete = document.createElement("button");
      btnDelete.append("Delete");
      newSongOption.append(btnDelete);
      btnDelete.addEventListener("click", function (e) {
        newSongOption.remove();
      });

      let voteButton = document.createElement("button");
      voteButton.append("This the shit");
      let displayVoteLike = document.createElement("p");
      newSongOption.append(displayVoteLike);
      newSongOption.append(voteButton);

      voteButton.addEventListener("click", function (e) {
        // if currentUser
        newSongOption.likes += 1;
        displayVoteLike.innerText = `Likes: ${newSongOption.likes} `;
        // create a song controller data base likes controller update likes
        api.trigger("Songs", "update", {
          title: track.name,
          artist: track.artists[0].name,
          uri: uri,
          likes: newSongOption.likes++,
        });
      });
    });
    let latestSong = songs.pop();
    fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${latestSong.uri}&device_id=${device}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer  ${params.access_token}`,
        },
        body: JSON.stringify({
          uri: latestSong.uri,
        }),
      }
    );
  });
}

let ul = document.createElement("ul");
document.body.append(ul);

const getCurrentUser = async () => {
  // setting await spotify_api.getMe() to variable
  currentUser = await spotify_api.getMe();

  let userInfo = {
    name: currentUser.display_name,
    email: currentUser.email,
    spotify_id: currentUser.id,
  };

  // call to api to set current user
  api.trigger("Users", "set_user", userInfo, function (currentUser) {
    let loggedIn = document.createElement("p");
    loggedIn.innerText = `Logged in as: ${currentUser.name}`;
    document.body.append(loggedIn);
  });
};

getCurrentUser();

// create an input for the search
// take value from the input
// make call to function
