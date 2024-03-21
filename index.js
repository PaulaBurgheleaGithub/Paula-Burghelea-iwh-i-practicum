require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const ACCESS_TOKEN = process.env.PRIVATE_ACCESS_TOKEN;
const BASE_URL = 'https://api.hubspot.com';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const title = 'Custome Object Data | HubSpot APIs';
    const objectType = "2-124824394";
    // const objectId = "objectId";
    const properties = ["name, type, stack, description"];

    const getObjects = `${BASE_URL}/crm/v3/objects/${objectType}?properties=${properties}`;

    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getObjects, { headers });
        const data = response.data.results;
        res.render('home', { title, data});
    } catch(err) {
        console.error(err);
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const title = 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    // http://localhost:3000/update-cobj?id=372324356
    const objectType = "2-124824394";
    const id = req.query.id;
    const properties = ["name, type, stack, description"];

    const getObject = `${BASE_URL}/crm/v3/objects/${objectType}/${id}?properties=${properties}`;
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getObject, { headers });
        const data = response.data;
        console.log("project info received");
        // res.json(data);
        res.render('update', {name: data.properties.name, type: data.properties.type, stack: data.properties.stack, description: data.properties.description, title});
        
    } catch(err) {
        console.error(err);
    }
});



// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const data = {
        properties: {
            "name": req.body.newName,
            "type": req.body.type,
            "stack": req.body.stack,
            "description": req.body.description,
        }
    };

    const objectType = "2-124824394";
    const id = req.query.id;
    const updateProjects = `${BASE_URL}/crm/v3/objects/${objectType}/${id}`;
    
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateProjects, data, { headers } );
        // res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});


app.get('/add',async (req, res) => {
    const title = 'Add Custom Object Form | Integrating With HubSpot I Practicum';

    const objectType = '2-124824394';
    const getProject = `${BASE_URL}/crm/v3/objects/${objectType}`;
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };
    try { 
        // await axios.post(newProject, { headers } );
        const response = await axios.get(getProject, { headers });
        const data = response.data;
        res.render('add', {title, data});
    } catch(err) {
        console.error(err);
    }
});

app.post('/add', async (req, res) => {
    const data = {
        properties: {
            "name": req.body.newName,
            "type": req.body.type,
            "stack": req.body.stack,
            "description": req.body.description,
        }
    };

    const objectType = "2-124824394";
    const newProject = `${BASE_URL}/crm/v3/objects/${objectType}`;
    
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try { 
        // TO DO - check if the name already exists in the entries of the project then run the post call
        await axios.post(newProject, data, { headers } );
        // res.send("New project successfully added!")
        res.redirect('/');
    } catch(err) {
        //TO DO - Need to word this error better
        //res.send(err.response.data.message.split(".")[1])
        console.error(err);
    }
});


app.get('/delete',async (req, res) => {
    const title = 'Delete Project | Integrating With HubSpot I Practicum';

    const objectType = "2-124824394";
    const id = req.query.objectId;
    const name = req.query.name

    const getProject = `${BASE_URL}/crm/v3/objects/${objectType}/${id}`;
    const headers = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };
    try { 
        // const name = req.query.name;
        const response = await axios.delete(getProject, { headers });
        const data = response.data;
        res.render('delete', {message: `Project successfully deleted!`, title});
    } catch(err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));