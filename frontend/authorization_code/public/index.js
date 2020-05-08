
  let currentUser = "";
  let device = "";

  
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
  
  let container = document.createElement('div')
  container.setAttribute('class', 'container-fluid')
  document.body.append(container)

  let row = document.createElement('div')
  row.setAttribute('class', 'row')
  container.append(row)


  let col1 = document.createElement('div')
  let col2 = document.createElement('div')
  let col3 = document.createElement('div')
  col1.setAttribute('class', 'col-sm')
  col2.setAttribute('class', 'col-sm')
  col3.setAttribute('class', 'col-sm')

  col1.setAttribute('id', 'col1')
  col2.setAttribute('id', 'col2')
  col3.setAttribute('id', 'col3')



  row.append(col1, col2, col3)


  container = document.querySelector('.container-fluid')
  col1 = document.querySelector('#col1')
  col2 = document.querySelector('#col2')
  col3 = document.querySelector('#col3')



  let searchHeading = document.createElement('h2')
  searchHeading.append('Search Songs')

  let queueHeading = document.createElement('h2')
  queueHeading.append('Queue')

  col2.append(searchHeading)
  col3.append(queueHeading)
  
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
  
  // let user select their device
  let deviceDiv = document.createElement('div')
  deviceDiv.setAttribute('id', 'device-div')
  container.append(deviceDiv)
  let deviceList = document.createElement("ul")
  deviceList.setAttribute('id', 'device-list')
  deviceDiv.appendChild(deviceList)
  //create Find Device button
  let findBtn = document.createElement('button')
  findBtn.innerText = "Find Device"
  let devDiv = document.getElementById('device-div')
  devDiv.appendChild(findBtn)
  //click 'find device' button and list devices
  findBtn.addEventListener('click', function(e){
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
      resp.devices.forEach(device => {
        console.log(device)
        let device_name = document.createElement('li')
        device_name.innerText = device.name
        deviceList.appendChild(device_name)
        device_name.addEventListener('click', function(){
          setDevice(device)
        })
      })
    });
  })
  
  function setDevice(device){
      device_id = device.id
      console.log(device_id)
  }
  
  // search form
  let searchForm = document.createElement("form");
  let input = document.createElement("input");
  searchForm.setAttribute("class", "song-search form-group");
  input.setAttribute("class", "form-control");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Search...");
  searchForm.append(input);
  let button = document.createElement("button");
  button.setAttribute("class", "form-control btn btn-primary");
  button.innerText = "Search";
  col2.append(searchForm);
  searchForm.append(button);
  
  async function searchSpotify() {
    let query = input.value;
    // let types = ["album", "artist", "playlist", "track"];
    const results = await spotify_api.search(query, ["track"], {"limit":10} );
    // const searchItems = results.tracks.items;
    let displayResult = document.createElement("ul");
    displayResult.setAttribute('class', 'list-group results')
    col2.append(displayResult);
    results.tracks.items.forEach((track) => {
      let uri = track.uri;
      let title = track.name;
  
        let artist = track.artists[0].name
        let artistName = artist;
        let songOption = document.createElement("li");
        songOption.style.fontSize = '14px'
        songOption.setAttribute('class', 'list-group-item')
        songOption.innerText = `${title} - ${artistName}`;
        displayResult.appendChild(songOption);
        songOption.addEventListener('mouseover', function() {
          songOption.setAttribute('class', 'list-group-item active')
        })
        songOption.addEventListener('mouseout', function() {
          songOption.setAttribute('class', 'list-group-item')
        })
        songOption.addEventListener("click", function () {
          console.log(songOption, uri, track);
          let ulSong = document.getElementById("song-queue");
          ulSong.innerHTML = "";
          selectedTrack(uri, track);
          displayResult.innerText = '';
          searchForm.reset()
        });
      });

  }

  liveQueue();
  
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchSpotify();
    // let results = document.querySelector('.results')
    // results.innerText = ""
    // searchForm.reset()
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
      let songQueue = document.createElement('ul')
      songQueue.setAttribute('id', 'song-queue')
      songQueue.setAttribute('class', 'list-group')
      songs.forEach((song) => {
        let newSongOption = document.createElement("div");
        newSongOption.setAttribute('class', 'list-group-item')
        let songTitle = document.createElement('h5')
        let songArtist = document.createElement('h6')
        songArtist.setAttribute('class', 'text-muted')
        newSongOption.append(songTitle, songArtist)
        newSongOption.likes = 0;
        newSongOption.likes.id = "likes-song";
        songTitle.innerText = `${song.title}`;
        songArtist.innerText = `${song.artist}`
        col3.append(songQueue)
        songQueue.appendChild(newSongOption);

  
        let voteButton = document.createElement("button");
        voteButton.setAttribute('class', 'btn btn-success btn-sm')
        voteButton.style.marginRight = '10px'
        voteButton.append("Like");
        newSongOption.append(voteButton);

        btnDelete = document.createElement('button')
        btnDelete.setAttribute('class', 'btn btn-secondary btn-sm')
        btnDelete.append('Remove')
        newSongOption.append(btnDelete);
        btnDelete.addEventListener("click", function (e) {
          newSongOption.remove();
        });


        let displayVoteLike = document.createElement("p");
        newSongOption.append(displayVoteLike);
        
  
        voteButton.addEventListener("click", function (e) {
          // if currentUser
          newSongOption.likes += 1;
          displayVoteLike.innerText = `Likes: ${newSongOption.likes} `;
          // create a song controller data base likes controller update likes
          fetch("http://localhost:8888/", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              likes: newSongOption.likes,
            }),
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
  
  let songDiv = document.createElement("div");
  songDiv.setAttribute('class', 'list-group')
  container.append(songDiv);
  
  function addToQueue(songUri) {
    ul.innerHTML = "";
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
      container.append(loggedIn);
    });
  };
  
  getCurrentUser();
  
  // create an input for the search
  // take value from the input
  // make call to function
  



