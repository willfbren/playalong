class CommentsWarpController < WarpCable::Controller

    def index(params)
        Comment.after_create do 
            yield({json: Comment.all, include: [:user]})
        end

        Comment.after_update do 
            yield({json: Comment.all, include: [:user]})
        end

        Comment.after_destroy do 
            yield({json: Comment.all, include: [:user]})
        end

        yield({json:Comment.all, include: [:user]})

    end

    def create(params)
        
        Comment.create({
            user_id: params[:user_id],
            content: params[:content]
        })

    end


end