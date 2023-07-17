const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "brand name model")
        .sort({ brand: 1 })
        .exec();

    res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id)
        .populate("category")
        .exec();

    if (item === null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {
        title: "Item Detail",
        item: item,
    });
});

// Display Item add form on GET.
exports.item_add_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item add GET");
});

// Handle Item add on POST.
exports.item_add_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item add POST");
});

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item update POST");
});
