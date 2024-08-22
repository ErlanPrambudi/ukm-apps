
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"

export const test = (req, res) => {
    res.json({ message: "API is working" })
}


export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { role, lembaga } = req.body;

    try {
        // Temukan user dan perbarui data
        const updatedUser = await User.findByIdAndUpdate(userId, { ...req.body }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {

        return next(errorHandler(400, "You are not allowed to delete this user"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("user has been delete")
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json("user has been sign out")
    } catch (error) {
        next(error)
    }
}
export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403), 'You are not allowed to see all user')
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === "asc" ? 1 : -1

        const users = await User.find({})
            .populate(
                "lembaga",
                "namaLembaga"
            )
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })


    } catch (error) {
        next(error)
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, 'user not found'))
        }
        const { password, ...rest } = user._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}
export const createUser = async (req, res, next) => {
    try {
        // Extract data from request body
        const { username, email, password, role, lembaga, profilePicture } = req.body;

        // Validate required fields
        if (!username || !email || !password || !role) {
            return next(errorHandler(400, 'Missing required fields'));
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, 'User already exists'));
        }
        const hashedPassword = bcryptjs.hashSync(password, 10)

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Make sure to hash the password before saving in a real-world application
            role,
            lembaga,
            profilePicture
        });

        // Save user to the database
        await newUser.save();

        // Respond with the created user
        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
};

