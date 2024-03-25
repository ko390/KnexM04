module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: '../FutBall.sqlite'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
};