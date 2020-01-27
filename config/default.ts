export default {
    config: {
        db: {
            type: "sqlite",
            name: "dev.db"
        },

        src: {
            fileExtension: ".ts",
            folder: ""
        },

        subways: {
            realTimeUrl: "Set url in correct environment. Example: https://apitransporte.buenosaires.gob.ar/subtes/serviceAlerts?json=1&client_id=<clientId>&client_secret=<clientSecret>",
            language: "es"
        },

        alarms: {
            utcOffset: "-03:00"
        },

        notifications: {
            configFile: "Set correct firebase config file, needs to be in config/push_notifications/"
        }
    }
};
