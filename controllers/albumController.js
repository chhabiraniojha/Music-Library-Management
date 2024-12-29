const Album = require("../models/Album");
const Artist = require("../models/Artist")

exports.getAlbums = async (req, res, next) => {
    try {
        const albums = await Album.findAll();
        return res.status(200).json({ message: 'Albums fetched successfully.', albums });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to fetch albums.', error: error.message });
    }
}

exports.getAlbumById = async (req, res, next) => {
    const albumId = req.params.id;

    try {
        const album = await Album.findByPk(albumId);
        if (!album) {
            return res.status(404).json({ message: 'Album not found.' });
        }
        return res.status(200).json({ message: 'Album fetched successfully.', album });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to fetch album details.', error: error.message });
    }
    res.json("success")
}


exports.addAlbum = async (req, res) => {
    const user = req.user;
    const { name, artistId, hidden } = req.body;

    //    validate required fields
    if (!name || !artistId || hidden == undefined) {
        return res.status(400).json({ message: 'Name and artistId and hidden are required .' });
    }

    if (typeof hidden != "boolean") {
        return res.status(400).json({ message: 'hidden must be true or false' });
    }
    // checking if the user is admit or editior or not
    if (user.role != "Admin" && user.role != "Editor") {
        return res.status(403).json({ message: 'You are not authorized to add albums.' });
    }

    try {
        // Check if the artist exists and belongs to the same organization
        const artist = await Artist.findOne({ where: { id: artistId, organisationId: user.organisationId } });
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found or does not belong to your organization.' });
        }

        const newAlbum = await Album.create({
            name,
            artistId,
            hidden
        });

        return res.status(201).json({ message: 'Album added successfully.', album: newAlbum });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Failed to add album.', error: error.message });
    }
};


//update album

exports.updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { name, hidden } = req.body;
    const user = req.user;

    // checking role of the user and authorization 

    if (user.role != "Admin" && user.role != "Editor") {
        return res.status(403).json({ message: 'You are not authorized to add albums.' });
    }
    //at least one field must be provided
    if (!name && typeof hidden == "undefined") {
        return res.status(400).json({ message: "Either 'name' or 'hidden' must be provided for the update." });
    }

    if (typeof hidden != "undefined" && typeof hidden != "boolean") {
        return res.status(400).json({ message: 'hidden must be true or false' });
    }



    try {
        // Fetch the album by ID
        const album = await Album.findOne({ where: { id } });
        console.log(album)

        // Check if the album exists
        if (!album) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        // Fetch the artist associated with the album
        const artist = await Artist.findOne({ where: { id: album.artistId } });

        // artist exists or not
        if (!artist) {
            return res.status(404).json({ message: 'Associated artist not found.' });
        }

        // user belongs to the same organisation as the artist
        if (artist.organisationId !== user.organisationId) {
            return res.status(403).json({ message: 'You are not authorized to update albums outside your organisation.' });
        }


        // Updating the database
        if (name) album.name = name;
        if (typeof hidden !== 'undefined') album.hidden = hidden;

        // Save the updated album
        await album.save();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to update the album.', error: error.message });
    }
};


//delete album by id
exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    // Checking if the user has the required role
    if (user.role !== 'Admin' && user.role !== 'Editor') {
        return res.status(403).json({ message: 'You are not authorized to delete albums.' });
    }
    try {
        // Fetch the album by ID
        const album = await Album.findOne({ where: { id } });

        // Check if the album exists
        if (!album) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        // Fetch the artist associated with the album
        const artist = await Artist.findOne({ where: { id: album.artistId } });

        // Checking if the artist exists 
        if (!artist) {
            return res.status(404).json({ message: 'Associated artist not found.' });
        }

        // Check if the user belongs to the same organisation as the artist
        if (artist.organisationId !== user.organisationId) {
            return res.status(403).json({ message: 'You are not authorized to delete albums outside your organisation.' });
        }



        // Delete the album
        await album.destroy();

        return res.status(200).json({ message: 'Album deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to delete the album.', error: error.message });
    }
};
