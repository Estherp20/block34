const express = require("express");
const app = express;

const { client } = require('./db');

const init =async () => {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('created tables');
    const [Hilton, ResidenceInn, Renaissance, Hyatt, Marriott, Courtyard, DoubleTree] = await Promise.all([
        createUser({ name: 'Hilton'}),
        createUser({ name: 'ResidenceInn'}),
        createUser({ name: 'Renaissance'}),
        createUser({ name: 'Hyatt'}),
        createPlace({ name: 'Marriott'}),
        createPlace({ name: 'Courtyard'}),
        createPlace({ name: 'DoubleTree'}),
    ]);
    console.log(await fetchUsers());
    console.log(await fetchPlaces());

    const [hotel, hotel2] = await Promise.all([
        createHotel({
        user_id: Hilton.id,
        Hotel_id: DoubleTree.id,
        departure_date: '02/14/2024'
        }),
        createHotel({
            user_id: Hilton.id,
            place_id: DoubleTree.id,
            departure_date: '02/28/2024'
        }),
    ]);
    console.log(await fetchHotel());
};

init();