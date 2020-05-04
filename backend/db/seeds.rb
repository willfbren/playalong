# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.destroy_all
Song.destroy_all
Playlist.destroy_all
PlaylistSong.destroy_all
PlaylistUser.destroy_all
Comment.destroy_all
Vote.destroy_all


User.create({ name: 'Tim' })
User.create({ name: 'Josh' })
User.create({ name: 'Rafa' })

Song.create({
    name: "Test Song",
    user_id: User.first.id
})

Vote.create({
    user_id: User.first.id,
    song_id: Song.first.id,
    total: 1
})

Playlist.create({
    name: "Test Playlist"
})

PlaylistSong.create({
    playlist_id: Playlist.first.id,
    song_id: Song.first.id
})

PlaylistUser.create({
    playlist_id: Playlist.first.id,
    user_id: User.first.id
})

Comment.create({
    user_id: User.first.id, 
    playlist_id: Playlist.first.id,
    content: "This is a comment."
})

