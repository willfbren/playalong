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


async function currentUser() {
    let currentUser = await spotify_api.getMe()
    // setting await spotify_api.getMe() to variable
    console.log(currentUser.display_name)
    console.log(currentUser.email)
    console.log(currentUser.id)

    api.trigger('Users', 'set_user', {
        name: currentUser.display_name,
        email: currentUser.email,
        spotify_id: currentUser.id
    }, function(user){
        console.log(user)
    } )

    // fetch('http://localhost:3000/set-user', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         name: currentUser.display_name,
    //         email: currentUser.email,
    //         spotify_id: currentUser.id
    //     })
    // })
    // .then(function (response){
    //     return response.json()
    // })
    // .then(function(user){
    //     console.log(user)
    // })
}

currentUser()

// create an input for the search
// take value from the input 
// make call to function