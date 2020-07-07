const Title = require('../models').Title;

exports.index = async (req, res) => {
    var lim = 10;
    const promise_array = [Title.findAndCountAll({
        where: { type: true },
        limit: lim,
        raw: true,
    }), Title.findAndCountAll({
        where: { type: false },
        limit: lim,
        raw: true,
    })];
    await Promise.all(promise_array).then(([seen_titles, rated_titles]) => {
        res.render('index', {
            printed_count: lim,
            seen_titles: seen_titles.rows,
            seen_titles_count: seen_titles.count,
            rated_titles: rated_titles.rows,
            rated_titles_count: rated_titles.count,
        });
    }).catch(err => {
        console.log("Erreur du chargement des données", err);
    });
};

// Display list of all Titles.
exports.titles_list = (req, res) => {
    Title.findAll({raw: true}).then(titles => {
        res.render("title_list", {
            title: "Entrées présentes dans la database", 
            titles_list: titles,
        });
    }).catch(err => {
        console.log("Erreur du chargement des données", err);
    });
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