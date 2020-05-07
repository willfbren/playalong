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
            byebug
            title: params[:title],
            artist: params[:artist],
            uri: params[:uri]
        })

    end


end