const Category = require("../models/category");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [
        numCategories,
        numItems
    ] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Music shop inventory application",
        category_count: numCategories,
        item_count: numItems,
    });
});

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec();

    res.render("category_list", { title: "Category List", category_list: allCategories });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, itemsOfCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "brand name model description").sort({ brand: 1 }).exec(),
    ]);
    if (category === null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        category: category,
        category_items: itemsOfCategory
    });
});

// Display Category add form on GET.
exports.category_add_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category add GET");
});

// Handle Category add on POST.
exports.category_add_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category add POST");
});

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category update POST");
});
