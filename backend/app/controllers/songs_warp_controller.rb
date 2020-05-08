class SongsWarpController < WarpCable::Controller

    def index(params)
        
        Song.after_create do 
            yield({json: Song.all})
        end

        Song.after_update do 
            yield({json: Song.all})
        end

        Song.after_destroy do 
            yield({json: Song.all})
        end

        yield({json:Song.all})

    end

    def create(params)
        
        Song.create({
            title: params[:title],
            artist: params[:artist],
            uri: params[:uri],
            likes: 0
        })

    end

    def update(params)
        
        Song.update({
            title: params[:title],
            artist: params[:artist],
            uri: params[:uri],
            likes: params[:likes]
        })

    end

    def delete(params)
    
        Song.destroy(params[:id])

    end 

end