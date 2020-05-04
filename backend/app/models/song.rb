class Song < ApplicationRecord
    belongs_to :user
    has_many :votes
    has_many :playlist_songs
    has_many :playlists, through: :playlist_songs
end