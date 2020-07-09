const validator = require('express-validator');
const moment = require('moment');

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
    Title.findAll().then(titles => {
        res.render("title_list", {
            title: "Entrées présentes dans la database",
            titles_list: titles,
        });
    }).catch(err => {
        console.log("Erreur du chargement des données", err);
    });
};

// Display detail page for a specific Title.
exports.title_detail = function (req, res, next) {
    Title.findByPk(req.params.id).then(result => {
        if (result == null) {
            var err = new Error("Entrée non présente dans la database.")
            err.status = 404;
            return next(err);
        }
        res.render('title_details', {
            title_details: result,
        });
    }).catch(err => {
        if (err) { return next(err); }
    });
};

// Display Title create form on GET.
exports.title_create_get = function (req, res) {
    res.render("title_form", { title: "Création d'une entrée" });
};

// Handle Title create on POST.
exports.title_create_post = [
    // Validate the attributes.
    validator.body('name', "Le nom de l'entrée est requis").trim().isLength({ min: 1 }),
    validator.body('date', "La date doit être au format DD/MM/YYYY").custom(date => {
        const formatedDate = moment(date, "DD/MM/YYYY", true);
        if(!formatedDate.isValid()) {
            return Promise.reject("La date n'est pas au format DD/MM/YYYY");
        }
        return Promise.resolve();
    }),
    validator.body('type', "Le type d'entrée est requis (Seen or Rated)").trim().isIn(["Seen", "Rated"]),
    // Sanitize (escape).
    validator.sanitizeBody('name').escape(),
    validator.sanitizeBody('type').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);
        // Create a title object with escaped and trimmed data.
        const title = Title.build({
            name: req.body.name,
            date: req.body.date,
            type: req.body.type,
        });
        // console.log(title);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('title_form', {
                title: "Création d'une entrée",
                created_title: title,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Title with same name and type already exists.
            Title.findOne({
                where: {
                    name: req.body.name,
                    type: (req.body.type === "Seen"),
                }
            }).then(async (old_title) => {
                // Title exists, redirect to its detail page.
                if (old_title) {
                    console.log("L'entrée existe déjà dans la database");
                    res.redirect(old_title.url);
                } else {
                    try {
                        await title.save();
                        // Title saved. Redirect to title detail page.
                        res.redirect(title.url);
                    } catch (err) {
                        if (err) { return next(err); }
                    }
                }
            })
        }
    }
];

// Display Title delete form on GET.
exports.title_delete_get = function (req, res) {
    Title.findByPk(req.params.id).then(result => {
        if (result == null) {
            console.log("Entrée non présente dans la database.");
            res.redirect("/catalog/titles");
        } else {
            res.render('title_delete', {
                title_details: result,
            });
        }
    }).catch(err => {
        if (err) { return next(err); }
    });
};

// Handle Title delete on POST.
exports.title_delete_post = function (req, res) {
    Title.findByPk(req.body.titleid).then(async (result) => {
        await result.destroy();
        res.redirect("/catalog/titles");
    }).catch(err => {
        if (err) { return next(err); }
    });
};

// Display Title update form on GET.
exports.title_update_get = function (req, res) {
    Title.findByPk(req.params.id).then(result => {
        if (result == null) {
            var err = new Error("Entrée non présente dans la database.")
            err.status = 404;
            return next(err);
        }
        res.render('title_form', {
            title: "Mise à jour d'une entrée",
            created_title: result,
        });
    }).catch(err => {
        if (err) { return next(err); }
    });
};

// Handle Title update on POST.
exports.title_update_post = [
    // Validate the attributes.
    validator.body('name', "Le nom de l'entrée est requis").trim().isLength({ min: 1 }),
    validator.body('date', "La date doit être au format DD/MM/YYYY").custom(date => {
        const formatedDate = moment(date, "DD/MM/YYYY", true);
        if(!formatedDate.isValid()) {
            return Promise.reject("La date n'est pas au format DD/MM/YYYY");
        }
        return Promise.resolve();
    }),
    validator.body('type', "Le type d'entrée est requis (Seen or Rated)").trim().isIn(["Seen", "Rated"]),
    // Sanitize (escape).
    validator.sanitizeBody('name').escape(),
    validator.sanitizeBody('type').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);
        // Create a title object with escaped and trimmed data.
        const title = Title.build({
            name: req.body.name,
            date: req.body.date,
            type: req.body.type,
            id: req.params.id,
        });
        console.log(title);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('title_form', {
                title: "Mise à jour d'une entrée",
                created_title: title,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Title.findOne({
                where: {
                    id: req.params.id,
                }
            }).then(async (old_title) => {
                await old_title.update({
                    name: req.body.name,
                    date: req.body.date,
                    type: req.body.type,
                });
                res.redirect(old_title.url);
            }).catch(err => {
                if (err) { return next(err); }
            });
        }
    }
];