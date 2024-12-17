const pg = require('pg');
const uuid = require('uuid');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservations_db');


const createTables = async()=> {
    const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurants;
        CREATE TABLE customer(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE reservation(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count integer NOT NULL,
            customer_id UUID REFERENCES customer(id) NOT NULL,
            restaurants_id UUID REFERENCES restaurants(id) NOT NULL
        );
    `;
    
    await client.query(SQL);
};


const createCustomer = async({name})=> {
    const SQL = `
      INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };
  
  const createRestaurants = async({name})=> {
    const SQL = `
      INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  }; 

  const fetchCustomer = async()=> {
    const SQL = `
  SELECT *
  FROM customer
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchRestaurants = async()=> {
    const SQL = `
  SELECT *
  FROM restaurants
    `;
    const response = await client.query(SQL);
    return response.rows;
  };    
  
  const createReservation = async({ restaurants_id, customer_id, date, party_count})=> {
    const SQL = `
      INSERT INTO reservation(id, restaurants_id, customer_id, date, party_count) VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), restaurants_id, customer_id, date, party_count]);
    return response.rows[0];
  };
  
  
  const fetchReservation = async()=> {
    const SQL = `
  SELECT *
  FROM reservation
    `;
    const response = await client.query(SQL);
    return response.rows;
  }; 

  const destroyReservation = async({ id, customer_id}) => {
    console.log( id, customer_id)
    const SQL = `
    DELETE FROM reservation
    WHERE id=$1 and customer_id=$2
    `;
    await client.query(SQL, [id, customer_id]);
  }


module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurants,
  fetchRestaurants,
  fetchCustomer,
  createReservation,
  fetchReservation,
  destroyReservation
}; 