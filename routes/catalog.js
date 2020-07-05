var express = require('express');
var router = express.Router();

var title_controller = require('../controllers/title');


// GET catalog home page.
router.get('/', title_controller.index);

// GET request for creating a Title. NOTE This must come before routes that display Title (uses id).
router.get('/title/create', title_controller.title_create_get);

// POST request for creating Title.
router.post('/title/create', title_controller.title_create_post);

// GET request to delete Title.
router.get('/title/:id/delete', title_controller.title_delete_get);

// POST request to delete Title.
router.post('/title/:id/delete', title_controller.title_delete_post);

// GET request to update Title.
router.get('/title/:id/update', title_controller.title_update_get);

// POST request to update Title.
router.post('/title/:id/update', title_controller.title_update_post);

// GET request for one Title.
router.get('/title/:id', title_controller.title_detail);

// GET request for list of all Title items.
router.get('/titles', title_controller.titles_list);

module.exports = router;