const express = require("express");
const app = express();

app.use(express.json());

const { client,
    createTables,
    createCustomer,
    createRestaurants,
    fetchRestaurants,
    fetchCustomer,
    createReservation,
    fetchReservation,
    destroyReservation,
 } = require('./db');

const init =async () => {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('created tables');
    const [Nuovo, TheGreatChicago, Crunch, Yoko, LincolnCafe, SaraBrickOven, Milts] = await Promise.all([
        createCustomer({ name: 'Nuovo'}),
        createCustomer({ name: 'TheGreatChicago'}),
        createCustomer({ name: 'Crunch'}),
        createCustomer({ name: 'Yoko'}),
        createRestaurants({ name: 'LincolnCafe'}),
        createRestaurants({ name: 'SaraBrickOven'}),
        createRestaurants({ name: 'Milts'}),
    ]);
    console.log(await fetchCustomer());
    console.log(await fetchRestaurants());

    const [reservation, reservation2] = await Promise.all([
        createReservation({
        customer_id: Nuovo.id,
        restaurants_id: Milts.id,
        date: '02/14/2024',
        party_count: 10,
        }),

        createReservation({
            customer_id: Nuovo.id,
            restaurants_id: Milts.id,
            date: '02/28/2024',
            party_count: 10,
        }),
    ]);
    console.log(await fetchReservation());
    await destroyReservation({id:reservation.id, customer_id: reservation.customer_id});
    console.log(await fetchReservation());

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};

init();

app.get('api/customers', async(req, res, next) => {
    try{
        res.send(await fetchCustomer());
    } catch(ex){
        next(ex);
    }
});

app.get('api/restaurants', async(req, res, next) => {
    try{
        res.send(await fetchRestaurants());
    } catch(ex){
        next(ex);
    }
});

app.get('api/reservations', async(req, res, next) => {
    try{
        res.send(await fetchReservation());
    } catch(ex){
        next(ex);
    }
});

app.post('api/customers/:id/reservations', async(req, res, next) => {
    try{
        res.status(201).send(await createReservation({ 
            restaurants_id: req.params.restaurants_id, 
            data: req.body.data, 
            party_count: req.body.party_count}
        ));
    } catch(ex){
        next(ex);
    }
});

app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next) => {
    try{
        await destroyReservation({customer_id:req.params.customer_id, id:req.params.id});
        res.sendStatus(204);
    } catch(ex){
        next(ex);
    }
})
