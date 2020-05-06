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


const currentUser = async() => {
    
    // setting await spotify_api.getMe() to variable
    let currentUser = await spotify_api.getMe()

    let userInfo = {
        name: currentUser.display_name,
        email: currentUser.email,
        spotify_id: currentUser.id
    }

    // call to api to set current user
    api.trigger( 'Users', 'set_user', userInfo, function(currentUser){
        let loggedIn = document.createElement('p')
        loggedIn.innerText = `Logged in as: ${currentUser.name}`
        document.body.append(loggedIn)
    })

}

currentUser()

// create an input for the search
// take value from the input 
// make call to function