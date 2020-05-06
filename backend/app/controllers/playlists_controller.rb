class PlaylistsController < ApplicationController

    # this will add song to queue
    def addToQueue
        song = Song.find_by(uri: params[:uri])
        render json: {uri: song.uri}
        puts song
    end 

    # queue list

    # song playing
end
