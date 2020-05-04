class CreatePlaylists < ActiveRecord::Migration[6.0]
  def change
    create_table :playlists do |t|
      t.string :name
      t.integer :user_id
      t.integer :song_id
      t.integer :comment_id
      t.integer :vote_id
    end
  end
end
