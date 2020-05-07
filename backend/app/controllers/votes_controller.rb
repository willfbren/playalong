class VoteController < ApplicationController

    def like
        newsongOption = Song.find_by(uri: params[:uri])
        newsongOption.likes += 1
        render json: {likes: newsongOption.likes}

    end


    def dislike
        newsongOption = Song.find_by(uri: params[:uri])
        newsongOption.disLikes += 1
        render json: {likes: newsongOption.disLikes}

    end

end


def like 
    @post = Post.find(params[:id])
    
    if @post.votes_for.voters.include?(current_user)
        @post.unliked_by current_user 
    else
        @post.liked_by current_user
    end
    
    redirect_to @post
end  