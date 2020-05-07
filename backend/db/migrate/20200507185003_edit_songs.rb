class EditSongs < ActiveRecord::Migration[6.0]
  def change
    rename_column :songs, :name, :title
    add_column :songs, :artist, :string
    add_column :songs, :uri, :string

  end
end
