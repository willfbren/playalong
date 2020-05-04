class User < ApplicationRecord
    has_many :comments
    has_many :songs
    has_many :votes, through: :songs
    has_many :playlist_users
    has_many :playlists, through: :playlist_users
end
