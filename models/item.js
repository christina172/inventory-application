const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    model: { type: String, required: true, maxLength: 100 },
    brand: { type: String, required: true, maxLength: 100 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true, maxLength: 1000 },
    details: { type: String, required: true, maxLemgth: 1000 },
    materials: { type: String, required: true, maxLemgth: 300 },
    accessories: { type: String, required: true, maxLemgth: 300 },
    image: { type: Buffer, contentType: String },
    price: { type: Number, required: true, min: 0 },
    number_in_stock: { type: Number, required: true, min: 0 },
});

// Virtual for full name
ItemSchema.virtual("full_name").get(function () {
    return `${brand} ${model} ${name}`;
});

// Virtual for item URL
ItemSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
