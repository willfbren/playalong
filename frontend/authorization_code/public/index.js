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