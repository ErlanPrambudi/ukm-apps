import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        namaLembaga: {
            type: String,
            unique: true,

        },
        ketua: {
            type: String,
            required: false,
            unique: false,
        },
        wakil: {
            type: String,
            required: false,
            unique: false,
        },
        sekretaris: {
            type: String,
            required: false,
            unique: false,
        },
        bendahara: {
            type: String,
            required: false,
            unique: false,
        },
        dpo: {
            type: String,
            required: false,
            unique: false,
        },
        image: {
            type: String,
            required: true,
            default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        },
        content: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: false,
            unique: true,
        },
    }, { timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;