Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  warp_resources(:users)

  post('/playlists/addToQueue', to: 'playlists#addToQueue')
  

end
