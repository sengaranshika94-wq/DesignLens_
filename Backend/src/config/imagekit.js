const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PVT_KEY
});

module.exports = imagekit;