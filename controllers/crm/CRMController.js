'use strict';
const axios = require("axios");
const {BigQuery} = require('@google-cloud/bigquery');
const {CreateUuid} = require('../../services/CreateUuid');
const path = require('path');
const fs = require('node:fs');

const serviceKey = path.join(__dirname, '../../secure-files/webis-hub-services-0502521dc83a.json');

class CRMController {

	async InsertData(req,res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);

		const createUuid = new CreateUuid();

		const databaseName = 'crms';
		const tableName = 'crm';

		const id = createUuid.invoke();

		const rows = [
		{id: id, nombre: req.body.nombre, descripcion: req.body.descripcion, estado: true, created_at: new Date()}
		];

		// Inserta los datos en la tabla
		bigquery.dataset(databaseName).table(tableName).insert(rows)
		.then((insertErrors) => {
			if (insertErrors['insertErrors'] && insertErrors['insertErrors'].length > 0) {
				console.error('ERROR al insertar datos:', insertErrors);
				res.status(200).json('ERROR al insertar datos')
			} 
			else {
				console.log('Datos insertados correctamente.');
				res.status(200).json();
			}
		})
		.catch((err) => {
			console.error('ERROR:', err);
		});
	}

	async GetData(req,res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);

		const databaseName = 'crms';
		const tableName = 'crm';

		const query = `SELECT * FROM ${databaseName}.${tableName}`;
		bigquery.query(query)
		.then((results) => {
			const rows = results[0];
			console.log('Resultados de la consulta:', rows);
			res.status(200).json(results)
		})
		.catch((err) => {
			res.status(200).json(err)
		});
	}

	async DeleteData(req,res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);

		const databaseName = 'crms';
		const tableName = 'crm';

		const query = `TRUNCATE TABLE ${databaseName}.${tableName}`;
		bigquery.query(query)
		.then((results) => {
			console.log('Toda la data ha sido borrada');
			res.status(200).json({});
		})
		.catch((err) => {
			res.status(200).json(err);
		});
	}

	async InsertClient(req,res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);
		const createUuid = new CreateUuid();

		const databaseName = 'cliente_admin';
		const tableName = 'cliente_admin';
		const id = createUuid.invoke();
		const idfirebase = req.body.idfirebase;

		const rows = [
			{
				id: id,
				id_firebase: idfirebase, 
				nombre: req.body.nombre, 
				apellido: req.body.apellido, 
				otros: req.body.otros, 
				timestamp: new Date()
			}
		];

		// Inserta los datos en la tabla
		bigquery.dataset(databaseName).table(tableName).insert(rows)
		.then((insertErrors) => {
			if (insertErrors['insertErrors'] && insertErrors['insertErrors'].length > 0) {
				console.error('ERROR al insertar datos:', insertErrors);
				res.status(200).json('ERROR al insertar datos')
			} 
			else {
				console.log('Cliente creado correctamente.');
				res.status(200).json('Cliente creado correctamente.');
			}
		})
		.catch((err) => {
			console.error('ERROR:', err);
		});
	}

	async InsertClientCRM(req,res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);
		const createUuid = new CreateUuid();

		const databaseName = 'cliente_crm';
		const tableName = 'cliente_crm';
		const id = createUuid.invoke();

		const rows = [
			{
				id: id,
				id_cliente: req.body.idcliente, 
				id_crm: req.body.idcrm, 
				client_id: req.body.clientid,
				client_secret: req.body.clientsecret, 
				api_key: req.body.apikey, 
				token: req.body.token,
				refresh_token: req.body.refreshtoken,
			}
		];

		// Inserta los datos en la tabla
		bigquery.dataset(databaseName).table(tableName).insert(rows)
		.then((insertErrors) => {
			if (insertErrors['insertErrors'] && insertErrors['insertErrors'].length > 0) {
				console.error('ERROR al insertar datos:', insertErrors);
				res.status(200).json('ERROR al insertar datos')
			} 
			else {
				console.log('Datos CRM de cliente creados satisfactoriamente.');
				res.status(200).json('Datos CRM de cliente creados satisfactoriamente.');
			}
		})
		.catch((err) => {
			console.error('ERROR:', err);
		});
	}

	async GetClientCRM(req, res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);
		const databaseName = 'cliente_crm';
		const tableName = 'cliente_crm';
		const clientId = req.body.id;

		const query = `SELECT * FROM ${databaseName}.${tableName} WHERE id = '${clientId}'`;
		bigquery.query(query)
		.then((results) => {
			const rows = results[0];
			res.status(200).json(rows);
		})
		.catch((err) => {
			res.status(200).json(err)
		});
	}

	async GetClientAndLogin(req, res) {

		const options = {
		  keyFilename: serviceKey,
		  projectId: 'webis-hub-services',
		};

		const bigquery = new BigQuery(options);
		const databaseName = 'cliente_crm';
		const tableName = 'cliente_crm';
		const clientId = req.body.id;
		const urlBase = req.body.url;

		const query = `SELECT * FROM ${databaseName}.${tableName} WHERE id = '${clientId}'`;
		bigquery.query(query)
		.then((results) => {

			if (results) {
				const rows = results[0];

	            const params = new URLSearchParams();
	            params.append('grant_type', 'client_credentials');
	            params.append('client_id', rows[0]['client_id']);
	            params.append('client_secret', rows[0]['client_secret']);
	            

	            axios({ 
	                method: 'POST',
	                url: urlBase + '/services/oauth2/token',
	                headers: { 
	                    'content-type': 'application/x-www-form-urlencoded',
	                },
	                data: params
	            })
	            .then(resps => { 

	            	const token = resps.data['access_token'];

		            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
		            const urlBase2 = jsonFile.URL_TUNEL;

		            const autho = 'Bearer ' + token;
		            const contactsByAccounts = '/services/data/v58.0/query/?q=SELECT+Id+,+Name+,+(+SELECT+Id+,+Name+,+Email+FROM+Contacts+)+FROM+Account';
		            axios({ 
		                method: 'GET',
		                baseURL: urlBase2,
		                url: contactsByAccounts,
		                headers: { 
		                    'Authorization': autho,
		                    'Content-Type': 'application/json',
		                    'url': urlBase,
		                },
		            })
		            .then(response => {

		            	let ress = {
		            		data: response.data,
		            		access_token: token
		            	};

		                res.status(200).json(ress);
		            })
		            .catch(err => {  res.status(500).json(err); });

	            })
	            .catch(err => { 
	            	console.log(err);
	            	res.status(200).json(err) 
	            });
			}
			else {
				res.status(401).json("Problema buscando los datos de salesforce");
			}

		})
		.catch((err) => {
			res.status(200).json(err)
		});

	}

}

module.exports = { CRMController }