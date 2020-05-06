class UpdateUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :username
    add_column :users, :spotify_id, :integer
  end
end
