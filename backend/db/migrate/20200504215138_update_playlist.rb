class UpdatePlaylist < ActiveRecord::Migration[6.0]
  def change
    remove_column :playlists, :vote_id
  end
end
