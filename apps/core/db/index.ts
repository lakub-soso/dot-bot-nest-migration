import { connectionSource } from './typeorm';

connectionSource.initialize().then(
    async () =>
    {
        process.exit(0);
    }
).catch(error => console.log(error));