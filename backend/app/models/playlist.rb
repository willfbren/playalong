class Playlist < ApplicationRecord
    has_many :users
    has_many :songs, through: :users
    has_many :comments
    has_many :playlist_songs
    has_many :playlist_users
    has_many :songs, through: :playlist_songs
    has_many :users, through: :playlist_users
end