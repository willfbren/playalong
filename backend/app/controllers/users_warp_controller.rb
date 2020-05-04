class UsersWarpController < WarpCable::Controller

    def index(params)
        User.after_create do
            yield({ json: User.all })
        end
        User.after_update do
            yield({ json: User.all })
        end
        User.after_destroy do
            yield({ json: User.all })
        end
        yield({ json: User.all }) # yield replaces `render`, but you still need json.
    end

    def create(params) # <-- This is the object passed into trigger
        User.create({
            name: params[:name] # <--- This is input.value
        })
    end

end