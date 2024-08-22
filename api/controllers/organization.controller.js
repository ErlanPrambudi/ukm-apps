import Organization from "../models/organization.model.js";
import Users from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new organization
export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create an organization"));
    }
    if (!req.body.namaLembaga || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    // Generate a unique slug based on 'ketua' and current timestamp
    const slug = `${req.body.ketua.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;

    const newOrganization = new Organization({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedOrganization = await newOrganization.save();
        res.status(201).json(savedOrganization);
    } catch (error) {
        next(error);
    }
};

// Get a list of organizations with optional filters
export const getorganizations = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const organizations = await Organization.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.namaLembaga && { namaLembaga: req.query.namaLembaga }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.organizationId && { _id: req.query.organizationId }),
            ...(req.query.searchTerm && {
                $or: [
                    { namaLembaga: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
        }).sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const totalOrganizations = await Organization.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthOrganizations = await Organization.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            organizations,
            totalOrganizations,
            lastMonthOrganizations,
        });
    } catch (error) {
        next(error);
    }
};

// Get organizations by user ID
export const getorganizationsbyUserId = async (req, res, next) => {
    try {
        const dataUser = await Users.find({
            ...(req.query.userId && { _id: req.query.userId }),
        });
        const organizations = await Organization.find({
            ...(dataUser[0].lembaga && { _id: dataUser[0].lembaga }),
        });
        res.status(200).json(organizations[0]);
    } catch (error) {
        next(error);
    }
};

// Delete an organization by ID
export const deleteorganization = async (req, res, next) => {
    if (req.user.role === 'user' || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this organization"));
    }
    try {
        await Organization.findByIdAndDelete(req.params.organizationId);
        res.status(200).json("Organization has been deleted");
    } catch (error) {
        next(error);
    }
};

// Update an organization by ID
export const updateorganization = async (req, res, next) => {
    if (req.user.role === 'user' || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this organization"));
    }
    try {
        const updatedOrganization = await Organization.findByIdAndUpdate(
            req.params.organizationId,
            {
                $set: {
                    namaLembaga: req.body.namaLembaga,
                    ketua: req.body.ketua,
                    wakil: req.body.wakil,
                    sekretaris: req.body.sekretaris,
                    bendahara: req.body.bendahara,
                    dpo: req.body.dpo,
                    content: req.body.content,
                    image: req.body.image,
                }
            },
            { new: true }
        );
        res.status(200).json(updatedOrganization);
    } catch (error) {
        next(error);
    }
};

// Update user's organization by ID
export const updateuserorganization = async (req, res, next) => {
    if (req.user.role === 'user' || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this organization"));
    }
    try {
        const updatedOrganization = await Organization.findByIdAndUpdate(
            req.params.organizationId,
            {
                $set: {
                    namaLembaga: req.body.namaLembaga,
                    ketua: req.body.ketua,
                    wakil: req.body.wakil,
                    sekretaris: req.body.sekretaris,
                    bendahara: req.body.bendahara,
                    dpo: req.body.dpo,
                    content: req.body.content,
                    image: req.body.image,
                }
            },
            { new: true }
        );
        res.status(200).json(updatedOrganization);
    } catch (error) {
        next(error);
    }
};
