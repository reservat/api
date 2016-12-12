let app = require('express')();
let r = require('ReservatCore')(require('./config/dev.json'));
let moment = require('moment');

app.use('/restaurant/(:id)', (req, res, next) => {
    r.Restaurant().findById(req.params.id)
    .then((restaurant) => {
        req.restaurant = restaurant;
        next()
    }, function(err) {
        res.status(err.status).send(err.message);
    });
});

app.get('/restaurant/(:id)/availability', (req, res) => {
    if(!req.query.partySize || !req.query.date) {
        res.status(400).send('Please provide both a partysize and date');
    } else {
        let date = moment.unix(req.query.date);
        req.restaurant.getAvailability().onDay(req.query.partySize, date)
        .then((availabilityMatrix) => {
            return availabilityMatrix.availableSlots();
        })
        .then((slots) => {
            res.send(slots);
        })
        .catch((err) => {
            res.status(500);
            res.send(err);
        });
    }
});

app.listen(3000);