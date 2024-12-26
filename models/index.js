const Organisation = require('./Organisation');
const User = require('./User');
const Artist = require('./Artist');
const Album = require('./Album');
const Track = require('./Track');
const Favorite = require('./Favorite');

Organisation.hasMany(User,{
    foreignKey: 'organisationId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
User.belongsTo(Organisation,{
    foreignKey: 'organisationId'
});



Organisation.hasMany(Artist,{
    foreignKey: 'organisationId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Artist.belongsTo(Organisation,{
    foreignKey: 'organisationId'
})



Artist.hasMany(Album,{
    foreignKey: 'artistId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Album.belongsTo(Artist,{
    foreignKey: 'artistId'
})



Artist.hasMany(Track,{
    foreignKey: 'artistId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Track.belongsTo(Artist,{
    foreignKey: 'artistId',
})

Album.hasMany(Track,{
    foreignKey: 'albumId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Track.belongsTo(Album,{
    foreignKey: 'albumId'
})


User.hasMany(Favorite,{
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Favorite.belongsTo(User,{
    foreignKey: 'userId'
})


Artist.hasMany(Favorite,{
    foreignKey: 'artistId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})

Favorite.belongsTo(Artist,{
    foreignKey: 'artistId'
})


Album.hasMany(Favorite,{
    foreignKey: 'albumId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})

Favorite.belongsTo(Album,{
    foreignKey: 'albumId'
})

Track.hasMany(Favorite,{
    foreignKey: 'trackId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
})

Favorite.belongsTo(Track,{
    foreignKey: 'trackId'
})



module.exports = { Organisation, User, Artist,Album,Track};
