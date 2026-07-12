import db from './db/db.js';
import userRegister from './userRegister.js';

const seedUsers = async () => {
    await userRegister();
};

const run = async () => {
    await db();
    await seedUsers();
    process.exit();
};

run();