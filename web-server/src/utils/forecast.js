const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.weatherapi.com/v1/current.json?key= e100cd478ce64441a8d104420240702&q=${latitude},${longitude}&aqi=yes`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('unable to connect location service', undefined);
        } else if (body.error) {
            callback('unable to find location', undefined)
        } else {
            callback(undefined, `it is currently ${body.current.temp_c}degree out. it's feel like ${body.current.feelslike_c} degree out`)
        }

    })
}

module.exports = forecast;