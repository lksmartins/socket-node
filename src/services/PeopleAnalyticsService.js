var PeopleAnalytics = require('../models/PeopleAnalytics')

module.exports = {

    async store( obj ) {

        console.log("🚀 ~ file: PeopleAnalyticsService.js ~ line 6 ~ store ~ obj", obj)

        try {
            await PeopleAnalytics.create( obj )
        } catch (e) {
            // Log Errors
            throw Error(`Error on creating people_analytics registry: ${e}`)
        }
    },

}