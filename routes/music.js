const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

/// CATEGORY ROUTES ///

// GET music catalog home page.
router.get("/", category_controller.index);

// GET request for adding a Category. NOTE This must come before routes that display Category (uses id).
router.get("/category/add", category_controller.category_add_get);

// POST request for adding Category.
router.post("/category/add", category_controller.category_add_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category items.
router.get("/categories", category_controller.category_list);

/// ITEM ROUTES ///

// GET request for adding an Item. NOTE This must come before routes that display Item (uses id).
router.get("/item/add", item_controller.item_add_get);

// POST request for adding Item.
router.post("/item/add", item_controller.item_add_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item items.
router.get("/items", item_controller.item_list);

module.exports = router;
