#! /usr/bin/env node

// const cremona = require("./images/cremona-violin.jpg");
// const yamahaViolin = require("./images/yamaha-violin.jpg");
// const hofner = require("./images/hofner-violin-balestrieri.jpg");
// const yamahaRecorder = require("./images/yamaha-recorder.jpg");

console.log(
    'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
    const category = new Category({
        name: name,
        description: description,
    });

    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
};

async function itemCreate(index, name, model, brand, category, description, details, materials, accessories, price, quantity) {
    const item = new Item({
        name: name,
        model: model,
        brand: brand,
        category: category,
        description: description,
        details: details,
        materials: materials,
        accessories: accessories,
        // image: image,
        price: price,
        number_in_stock: quantity,
    });

    await item.save();
    items[index] = item;
    console.log(`Added item: ${brand} ${model} ${name}`);
};

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(0, "Pianos", "We offer a wide range of excellent instruments, including upright and grand pianos, for beginners and professionals alike."),
        categoryCreate(1, "Violins", "We offer violins from the best makers to suit the needs of musicians of different levels from beginners to professionals. Here, you can find a violin of every size and for every budget."),
        categoryCreate(2, "Recorders", "Find the best recorder to suit your needs. Perfect for everyone from children to professionals! Browse our large range of recorders, spanning a variety of colours, sizes, and materials."),
    ]);
    ;
}

async function createItems() {
    console.log("Adding items");
    await Promise.all([
        itemCreate(0, "Violin outfit, 1/2 size", "SV130", "Cremona", categories[1], "Inspired by the masters. The Cremona SV130 violin is the perfect instrument to start your musical career on. The design of the Cremona SV130 was influenced by the classic Italian models from the Golden Age period. This is especially clear when observing the handcarved Stradivarius arching on the top and back.", "Strad body type, Cremona bridge, Alloy tailpiece with 4 fine tuners", "Top: Solid spruce. Back, side and ribs: Solid maple. Neck: Maple. Fingerboard, tunning pegs, chinrest: Ebony, Finish: Warm brown finish", "The outfit includes a shaped styrofoam case with adjustable shoulder straps, a round bulletwood bow, rosin and comes complete with D'Addario Prelude strings.", 348, 10),
        itemCreate(1, "Intermediate violin outfit, full size", "V10SG", "Yamaha", categories[1], "Take a sophisticated step. The Yamaha V10SG intermediate violin outfit lets you move on with rich sound. Such warmth comes from the classic Stradivari design in refined Yamaha Maple and Spruce. An Aubert bridge is a mark of quality to bring out your best acoustics. Likewise, a Wittner fine tuner on the E string lets you tune with remarkable detail. With a sound this advanced you won't want to stop practising.", "Stradivarius body shape, Aubert type bridge with parchment, Wittner E string fine tuner", "Top wood: Spruce. Back, sides, neck: Maple. Fingerboard, tunning pegs, tailpiece, chin rest: Ebony. Finish: Hand brushed oil varnish", "Complete with a Yamaha VHC2 Hard Case, Pernambuco bow, Schwarz Violin Rosin and quality Thomastik Dominant strings.", 1576, 4),
        itemCreate(2, "Violin, full size", "H225-TB-V Tommaso Balestieri", "Karl Höfner", categories[1], "Handmade in Germany, these Hofner master instrument is copied from a fine historical instrument by Tommaso Balestieri. Höfner H225 Violins are made from exquisite tone wood and are exclusively handcrafted by skilled luthiers, giving each instrument its own character.", "No fine tuners, only Fine Tuning Screw for E string. Thomastik Vision strings", "Top: Alpine Spruce. Back,sides,neck: European Maple. Fingerboard, nuts: Ebony. Wood quality: AAA. Finish: Hand oil antique varnish.", "Bow and case are not included.", 4407, 2),
        itemCreate(3, "Alto Recorder, Baroque Fingering", "YRA28B", "Yamaha", categories[2], "The perfect introduction to music. Made from ABS resin, the YRA28B recorder offers a durable build quality while only needing little maintenance. Offering a suitable amount of air resistance for easy control, the YRA28B features excellent intonation that is often associated with much more expensive models.", "Baroque system, Straight windway, Double toneholes, Body Sections: 3", "ABS Resin", "Carry Bag, Recorder Cream, Cleaning Rod, and Fingering Chart included", 30, 8),
    ]);
};