const Artist = require("../models/Artist")
const Album = require("../models/Album")
const Track = require("../models/Track")



// get all tracks
exports.getTracks = async (req, res) => {
    try {
        const tracks = await Track.findAll();
        return res.status(200).json({ message: "all tracks are fetched successfully", tracks })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch albums.', error: error.message });
    }
}


//get track by id

exports.getTrackbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const track = await Track.findByPk(id);
        return res.status(200).json({ message: "track fetched successfully", track })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch albums.', error: error.message });
    }
}

// add tracks
exports.addTrack = async (req, res) => {
    const user = req.user;
    const { name, duration, artistId, albumId } = req.body

    if (!name || !duration || !artistId) {
        return res.status(400).json({ message: 'name,artist and duration is required' });
    }

    // role should be admin or editor
    if (user.role !== 'Admin' && user.role !== 'Editor') {
        return res.status(403).json({ message: 'You are not authorized to add artists.' });
    }


    try {

        //    check artist is present or belongs to the users organisation or not

        const artist = await Artist.findOne({
            where: {
                id: artistId,
                organisationId: user.organisationId
            }
        })
        if (!artist) {
            return res.status(404).json({ message: "Artist not found or artist does not belongs to your organisation." });
        }

        // checking if album id is present and also belongs to the artist given
        if (albumId) {
            const album = await Album.findOne({
                where: {
                    id: albumId,
                    artistId
                }
            })
            if (!album) {
                return res.status(404).json({ message: "Album not found or album does not belongs to the artist" });
            }
        }


        const newTrack = await Track.create({
            name,
            duration,
            artistId,
            albumId: albumId ? albumId : null
        })

        return res.status(201).json({
            message: 'Track added successfully.',
            data: newTrack,
        });

    } catch (error) {
        return res.status(500).json({ message: "tract addition failed", error: error.message })
    }


}

// update track by id
exports.updateTrack = async (req, res) => {
    const { id } = req.params;
    const { name, artistId, albumId, duration } = req.body; // Fields to update
    const user = req.user;

    //validate input fields
    if (!name && !artistId && !albumId && !duration) {
        return res.status(400).json({ message: 'atleast give one value for updation field should be name,artistId, albumId, duration' });
    }

    //validate user role 
    if (user.role != "Admin" && user.role != "Editor") {
        return res.status(403).json({ message: "you are not authorised to update track" })
    }

    try {
        // Fetch track by ID
        const track = await Track.findByPk(id);
        if (!track) {
            return res.status(404).json({ message: 'Track not found.' });
        }
        if (artistId && !albumId) {
            const artist = await Artist.findOne({
                where: {
                    id: artistId,
                    organisationId: user.organisationId
                }
            })
            if (!artist) {
                return res.status(404).json({ message: "artist not found or artist is not from your organisation" })
            }
        }
        if (!artistId && albumId) {
            const album = await Album.findOne({
                where: {
                    id: albumId,
                }
            })
            if (!album) {
                return res.status(404).json({ message: "album not found" })
            }


            const artist = Artist.findOne({
                where: {
                    artist: album.artistId,
                    organisationId: user.organisationId
                }
            })
            if (!artist) {
                res.status(404).json({ message: "album is not from your organisation" })
            }

        }
        

        if (albumId && artistId) {
            const album = await Album.findByPk(albumId);
            if(!album){
                return res.status(404).json({ message: "album not found" })
            }
            const artist =await Artist.findOne({
                id:album.artistId,
            })

            if (!artist){
                return res.status(404).json({ message: "artist for this album not found" })
            }
            
            if(artist.organisationId!==user.organisationId){
                return res.status(403).json({ message: "artist and album is not from your organisation" })
            }

        }

        if (name) track.name=name;
        if (duration) track.duration =duration;
        if (artistId) track.artistId=artistId;
        if (albumId) track.albumId=albumId;

        await track.save();
        return res.status(204).send(); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update track.', error: error.message });
    }

};




//delete track by id
exports.deleteTrack = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (user.role != "Admin" && user.role != "Editor") {
        res.status(403).json({ message: "you are not authorised" })
    }

    try {
        const track = await Track.findByPk(id);
        if (!track) {
            return res.status(404).json({ message: "track not found" })
        }

        // fething the artist to compare the track organisation and user organisation

        const artist = await Artist.findByPk(track.artistId)

        if (artist.organisationId !== user.organisationId) {
            return res.status(403).json({ message: 'You are not authorized to delete this track outside your organisation.' });
        }
        await track.destroy();

        return res.status(200).json({ message: 'Track deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete track.', error: error.message });
    }

}