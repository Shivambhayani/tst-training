const request = require('request')

const geocode = (address, callback) => {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=946141240c5c41b3acb83b6c8a430a24`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('unable to connect location service', undefined);
        } else if (body.features.length === 0) {
            callback(('Unable to find location.', undefined));
        } else {
            callback(error, {
                latitude: body.features[0].properties.lat,
                longitude: body.features[0].properties.lon,
                location: body.features[0].properties.country
            })
        }
    })

}

module.exports = geocode;