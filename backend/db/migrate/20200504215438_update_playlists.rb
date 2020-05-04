class UpdatePlaylists < ActiveRecord::Migration[6.0]
  def change
    remove_column :playlists, :user_id
    remove_column :playlists, :song_id
    remove_column :playlists, :comment_id
  end
end
