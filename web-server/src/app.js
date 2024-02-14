const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { error } = require('console')
const app = express()

//  Define path foe express config
const pathdir = path.join(__dirname, '../public')
const viewdir = path.join(__dirname, '../templates/views')
const hbsdir = path.join(__dirname, '../templates/partials')

// console.log(pathdir);

//  Handlenbars engine  and view locations
app.set('view engine', 'hbs');
app.set('views', viewdir)
hbs.registerPartials(hbsdir)

//  setup static directory
app.use(express.static(pathdir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Shivam'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Avengers',
        name: 'Shivam'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Any query conctac Us",
        name: 'ABC'
    })
})
// weather endpoint
app.get("/weather", (req, res) => {
    if (!req.query.address) {
        res.send({
            error: "please peovide address"
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send(error)
        }

        forecast(latitude, longitude, (error, forecastdata) => {
            if (error) {
                return res.send(error)
            }

            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })
        })
    })
    // console.log(req.query.search);
    // res.send({

    //     forecast: "It is Showing",
    //     location: "India",
    //     address: req.query.address
    // })
})
//  product array
app.get('/product', (req, res) => {

    if (!req.query.search) {
        res.send({
            error: 'You must Provide a Search term'
        })
    }
    console.log(req.query.search);
    res.send({
        product: []
    })
})

// error
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        name: 'ABC',
        errormessage: 'Help Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        name: 'xyz',
        errormessage: "Page not Found !"
    })
})


// port
const port = 3000;
app.listen(port, () => {
    console.log(`server is run on ${port}`);
})