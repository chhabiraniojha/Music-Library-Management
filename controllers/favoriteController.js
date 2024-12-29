const Album = require("../models/Album")
const Artist = require("../models/Artist")
const Track = require("../models/Track")
const Favorite = require("../models/Favorite")


//get favorite by category belongs to the user
exports.getFavoritesByCategory = async (req, res) => {
    const { category } = req.params;
    const user = req.user;

    //category validation
    if (category != "Album" && category != "Artist" && category != "Track") {
        return res.status(400).json({ message: "category must be Album or Artist or Track" });
    }
    try {
        // Fetch favorites based on category
        const favorites = await Favorite.findAll({
            where: {
                userId: user.id,
                category,
            }
        });
        return res.status(200).json({message:"favorites fetched successfully", favorites });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to retrieve favorites.", error: error.message });
    }
};


// add favorite
exports.addFavorite = async (req, res) => {
    const user = req.user;
    const { name, category, itemId } = req.body;
    // console.log(name,category,itemId)

    // validate required fields
    if (!name || !category || !itemId) {
        return res.status(400).json({ message: "all fields are required" });
    }

    //category validation
    if (category != "Album" && category != "Artist" && category != "Track") {
        return res.status(400).json({ message: "category must be Album or Artist or Track" });
    }

    try {
        // checking the item exists in the specified category or not
        let item;
        if (category === "Album") {
            item = await Album.findByPk(itemId);
        } else if (category === "Artist") {
            item = await Artist.findByPk(itemId);
        } else if (category === "Track") {
            item = await Track.findByPk(itemId);
        }

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }


        // Checking if the favorite already exists
        const existingFavorite = await Favorite.findOne({
            where: { userId: user.id, category, itemId }
        });

        if (existingFavorite) {
            return res.status(400).json({ message: "Item is already in your favorites." });
        }

        // Add the favorite
        const newFavorite = await Favorite.create({
            name,
            userId: user.id,
            category,
            itemId,
        });

        return res.status(201).json({ message: "Favorite added successfully.", favorite: newFavorite });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to add favorite.", error: error.message });
    }
};

//remove favorite

exports.removeFavorite = async (req, res) => {
    const { id } = req.params; // Favorite ID from URL
    const user = req.user; // Authenticated user

    try {
        // Fetch the favorite by ID
        const favorite = await Favorite.findOne({
            where: { id, userId: user.id },
        });

        // If the favorite is not found, return 404
        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found." });
        }

        // Delete the favorite
        await favorite.destroy();

        return res.status(200).json({ message: "Favorite removed successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to remove favorite.", error: error.message });
    }
};
