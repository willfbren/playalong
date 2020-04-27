const API_DOMAIN = 'http://localhost:3000/cable'

let api = WarpCable(API_DOMAIN)

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

let params = getHashParams()
if (params.access_token == undefined) {
    window.location.replace('/login')
}
let spotify_api = new SpotifyWebApi
spotify_api.setAccessToken(params.access_token)


    let test = document.createElement('h1')
    test.innerText = "PlayAlong Playlist"
    document.body.append(test)
    let searchForm = document.createElement('form')
    let input = document.createElement('input')
    searchForm.setAttribute('class', 'song-search')
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'Search for a song')
    searchForm.append(input)
    let button = document.createElement('button')
    button.innerText = "Search"
    document.body.append(searchForm)
    searchForm.appendChild(button)

    searchForm.addEventListener('submit', function(e){
        e.preventDefault()
        async function searchSpotify(){
            let query = input.value
            let types = ['album', 'artist', 'playlist', 'track']
            const results = await spotify_api.search(query, types)
            const searchItems = results.tracks.items
            console.log(searchItems)
            const songUri = searchItems[0].uri
            // console.log(songUri)
            fetch(`https://api.spotify.com/v1/me/player/queue?uri=${songUri}&device_id=3d17a6c934e6bc24eab67f4c13817f0aa00ad7aa`,{
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer  ${params.access_token}`
                },
                body: JSON.stringify({
                    uri: songUri
                })
            })
        }
        searchSpotify()
    })
    

function addToQueue(songUri){
    fetch(`http://localhost:3000/playlists/addToQueue`, {
        method: "POST",
        headers: 
        {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "uri": songUri
        })
      })
    .then(function(resp){
      return resp.json()
    })
    .then(function(song){
        
        //what do we do here?
    }) 
}

