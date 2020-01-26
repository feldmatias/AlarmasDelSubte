export default {
    config: {
        db: {
            type: "sqlite",
            name: ":memory:"
        },

        subways: {
            realTimeUrl: "someurl.test.com"
        },

        notifications: {
            configFile: "firebase_config.example.json"
        }

    }
};