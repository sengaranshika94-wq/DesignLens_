const multer = require('multer')
const storage= multer.memoryStorage()//ss is temporarily kept in memory as buffer instead of being saved to a folder in comp
const upload = multer({
    storage:storage
})

module.exports = upload