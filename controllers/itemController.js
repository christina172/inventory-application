const Item = require("../models/item");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
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
    // Get all categories, which we can use to add new item.
    const allCategories = await Category.find().exec();

    res.render("item_form", {
        title: "Add Item",
        categories: allCategories,
    });
});

// Handle Item add on POST.
exports.item_add_post = [
    // Validate and sanitize the name field.
    body("name", "Item name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("model", "Item model must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("brand", "Item brand must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Item description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("details", "Item details must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("materials", "Item materials must be between 1 and 300 characters long.")
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape(),
    body("accessories", "Item accessories must be between 1 and 300 characters long.")
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape(),
    body("price", "Item price must be an integer and must be greater than 1 $ and smaller than 100 000 $.")
        .trim()
        .isInt({ min: 1, max: 100000 })
        .escape(),
    body("number_in_stock", "Item quantity (number in stock) must be an integer.")
        .trim()
        .isInt()
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an item object with escaped and trimmed data.
        const item = new Item({
            name: req.body.name,
            model: req.body.model,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            details: req.body.details,
            materials: req.body.materials,
            accessories: req.body.accessories,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const allCategories = await Category.find().exec();

            res.render("item_form", {
                title: "Add Item",
                item: item,
                categories: allCategories,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save item.
            await item.save();
            res.redirect(item.url);
        }
    }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of item
    const item = await Item.findById(req.params.id).exec();

    if (item === null) {
        // No results.
        res.redirect("/music/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item,
    });
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndRemove(req.body.itemid);
    res.redirect("/music/items");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    // Get item
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().exec(),
    ]);

    if (item === null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: allCategories,
    });
});

// Handle Item update on POST.
exports.item_update_post = [
    // Validate and sanitize the name field.
    body("name", "Item name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("model", "Item model must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("brand", "Item brand must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Item description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("details", "Item details must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("materials", "Item materials must be between 1 and 300 characters long.")
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape(),
    body("accessories", "Item accessories must be between 1 and 300 characters long.")
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape(),
    body("price", "Item price must be an integer and must be greater than 1 $ and smaller than 100 000 $.")
        .trim()
        .isInt({ min: 1, max: 100000 })
        .escape(),
    body("number_in_stock", "Item quantity (number in stock) must be an integer.")
        .trim()
        .isInt()
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Item object with escaped/trimmed data and old id.
        const item = new Item({
            name: req.body.name,
            model: req.body.model,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            details: req.body.details,
            materials: req.body.materials,
            accessories: req.body.accessories,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            const allCategories = await Category.find().exec();

            res.render("item_form", {
                title: "Add Item",
                item: item,
                categories: allCategories,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Update the record.
            const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
            // Redirect to item detail page.
            res.redirect(theitem.url);
        }
    }),
];
