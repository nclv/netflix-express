const Title = require('../models').Title;

exports.index = async (req, res) => {
    const promise_array = [Title.findAndCountAll({
        where: { type: true },
        limit: 10,
        order: [["date", "DESC"]],
        raw: true,
    }), Title.findAndCountAll({
        where: { type: false },
        limit: 10,
        order: [["date", "DESC"]],
        raw: true,
    })];
    const [seen_titles, rated_titles] = await Promise.all(promise_array);

    return res.render('index', {
        title: 'Titles Home',
        seen_titles: seen_titles,
        rated_titles: rated_titles
    });
};

// Display list of all Titles.
exports.titles_list = function (req, res) {
    res.send('NOT IMPLEMENTED: Titles list');
};

// Display detail page for a specific Title.
exports.title_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: Title detail: ' + req.params.id);
};

// Display Title create form on GET.
exports.title_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Title create GET');
};

// Handle Title create on POST.
exports.title_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Title create POST');
};

// Display Title delete form on GET.
exports.title_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Title delete GET');
};

// Handle Title delete on POST.
exports.title_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Title delete POST');
};

// Display Title update form on GET.
exports.title_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Title update GET');
};

// Handle Title update on POST.
exports.title_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Title update POST');
};