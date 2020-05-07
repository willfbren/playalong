class SongController < ApplicationController

    def actualSong
        song = Song.find_by(uri: params[:uri])
        render json: {uri: song.uri}

    end

end