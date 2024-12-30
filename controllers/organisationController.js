const Organisation= require("../models/Organisation")


exports.addOrganisation = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "name is required" })
    }
    try {
        const organisation=await Organisation.create({
            name
        })
        return res.status(201).json({message:"organisation created successfully",data:organisation})
    } catch (error) {
        return res.status(500).json({message:"organisation creation failed",error:error.message})
    }

}

exports.getOrganisations = async (req, res) => {
    try {
        const organisations=await Organisation.findAll();
        return res.status(200).json({message:"organisation fetched successfully",data:organisations})
    } catch (error) {
        return res.status(500).json({message:"organisation retrival failed",error:error.message})
    }
}