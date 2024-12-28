const Artist = require('../models/Artist')



//get  all artists
exports.getArtists = async (req, res) => {
    try {
        // Fetch all artists from the database
        const artists = await Artist.findAll();
        return res.status(200).json({ message: "Artists retrieved successfully.", data: artists });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to fetch artists.", error: error.message });
    }
};



// get artist by id


exports.getArtistById = async (req, res) => {
    const { id } = req.params;


    try {
        const artist = await Artist.findByPk(id);

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found.' });
        }

        return res.status(200).json({ message: 'Artist retrieved successfully.', data: artist });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to fetch artist.', error: error.message });
    }
};



// add artist

exports.addArtist = async (req, res) => {
    const user = req.user;
    console.log(user)
    const { name, hidden } = req.body;

    // role should be admin or editor
    if (user.role !== 'Admin' && user.role !== 'Editor') {
        return res.status(401).json({ message: 'You are not authorized to add artists.' });
    }

    // Validate the required fields
    if (!name) {
        return res.status(400).json({ message: 'Artist name is required.' });
    }

    // Validate the hidden field
    if (hidden !== undefined && typeof hidden !== 'boolean') {
        return res.status(400).json({ message: 'Hidden field must be a boolean (true or false).' });
    }

    try {
        // Create the artist with the user's organisationId
        const newArtist = await Artist.create({
            name,
            organisationId: user.organisationId,
            hidden
        });

        return res.status(201).json({
            message: 'Artist added successfully.',
            data: newArtist,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to add artist.' });
    }
};


// update artist details like name and hidden field

exports.updateArtist = async (req, res) => {
    const { id } = req.params; 
    const { name, hidden } = req.body; 
    const user = req.user; 

    // Ensure at least one of name or hidden is provided
    if (!name && hidden == '') {
        return res.status(400).json({ message: "Either 'name' or 'hidden' must be provided for update." });
    }

    // Validating hidden field
    if (typeof hidden !== 'boolean') {
        return res.status(400).json({ message: "'hidden' must be a boolean value (true or false)." });
    }

    try {
        // Fetch the artist by ID
        const artist = await Artist.findOne({ where: { id } });

        if (!artist) {
            return res.status(404).json({ message: "Artist not found." });
        }

        // Check if the user belongs to the same organisation
        if (artist.organisationId !== user.organisationId) {
            return res.status(403).json({ message: "You can only update artists in your organisation." });
        }

        // Only Admin or Editor can update an artist
        if (user.role !== 'Admin' && user.role !== 'Editor') {
            return res.status(403).json({ message: "You are not authorized to update artists." });
        }

        // Update fields if valid
        if (name) artist.name = name;
        if (typeof hidden !== 'undefined') artist.hidden = hidden;

        // Save the updated artist
        await artist.save();

        // Return a 204 status code for successful update (no content)
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to update artist.", error: error.message });
    }
};



// delete artist by their organisations admin and editors only
exports.deleteArtist = async (req, res) => {
    const { id } = req.params; 
    const user = req.user; 

    try {
        // Fetch the artist by ID
        const artist = await Artist.findOne({ where: { id } });

        if (!artist) {
            return res.status(404).json({ message: "Artist not found." });
        }

        // Check if the user belongs to the same organisation
        if (artist.organisationId !== user.organisationId) {
            return res.status(403).json({ message: "You can only delete artists from your organisation." });
        }

        // Only Admin or Editor can delete an artist
        if (user.role !== 'Admin' && user.role !== 'Editor') {
            return res.status(403).json({ message: "You are not authorized to delete artists." });
        }

        // Delete the artist
        await artist.destroy();

        return res.status(200).json({ message: "Artist deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to delete artist.", error: error.message });
    }
};
