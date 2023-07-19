const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
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
    res.render("category_form", { title: "Add Category" });
});

// Handle Category add on POST.
exports.category_add_post = [
    // Validate and sanitize the name field.
    body("name", "Category name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must be between 1 and 250 characters long.")
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Add Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Category with same name already exists.
            const categoryExists = await Category.findOne({ name: req.body.name }).exec();
            if (categoryExists) {
                // Category exists, redirect to its detail page.
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                // New genre saved. Redirect to genre detail page.
                res.redirect(category.url);
            }
        }
    }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of category and all items of this category
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "brand name model").exec(),
    ]);

    if (category === null) {
        // No results.
        res.redirect("/music/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: allItemsInCategory,
    });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of category and all items of this category
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "brand name model").exec(),
    ]);

    if (allItemsInCategory.length > 0) {
        // Category has items. Render in same way as for GET route.
        res.render("author_delete", {
            title: "Delete Author",
            category: category,
            category_items: allItemsInCategory,
        });
        return;
    } else {
        // Category has no items. Delete object and redirect to the list of categories.
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect("/music/categories");
    }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get category
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {
        title: "Update Category",
        category: category,
    });
});

// Handle Category update on POST.
exports.category_update_post = [
    // Validate and sanitize the name field.
    body("name", "Category name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must be between 1 and 250 characters long.")
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Category object with escaped/trimmed data and old id.
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Add Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            const thecategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            // Redirect to category detail page.
            res.redirect(thecategory.url);
        }
    }),
];
