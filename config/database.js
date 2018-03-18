if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://ajay:vidjot@ds117489.mlab.com:17489/vidjotprod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/videojot'
    }
}