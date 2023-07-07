const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item list");
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
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
