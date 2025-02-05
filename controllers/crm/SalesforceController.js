'use strict';
const axios = require("axios");
const {BigQuery} = require('@google-cloud/bigquery');
const {CreateUuid} = require('../../services/CreateUuid');
const path = require('path');
const fs = require('node:fs');
const {SpeechToText} = require('../../services/SpeechToText');
const {OpenAi} = require('../../services/OpenAI');
const {Buffer} = require('buffer');
const {CreateFileLocal} = require('../../services/CreateFileLocal');
const {DeleteFileLocal} = require('../../services/DeleteFileLocal');
const {UploadFileInABucket} = require('../../services/UploadFileInABucket');

class SalesforceController {


	async loginSalesforce(req, res) {

        if (req.headers['client_id'] && req.headers['client_secret'] && req.headers['grant_type']) {
            // const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            // const urlBase = jsonFile.URL_TUNEL;
            const urlBase = req.headers['url'];

            const params = new URLSearchParams();
            params.append('client_id', req.headers['client_id']);
            params.append('client_secret', req.headers['client_secret']);
            params.append('grant_type', req.headers['grant_type']);

            axios({ 
                method: 'POST',
                baseURL: urlBase,
                url: '/services/oauth2/token',
                responseType: 'json',
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                },
                data: params
            })
            .then(response => { res.status(200).json(response.data) })
            .catch(err => {     res.status(200).json(err) });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not match the needed data'
            }
            res.status(402).json(err);
        }
	}



	async getUserMe(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;

            const token = 'Bearer ' + req.headers['access_token'];

            axios({ 
                method: 'POST',
                baseURL: urlBase,
                url: '/services/oauth2/userinfo',
                responseType: 'json',
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'url': req.headers['url'],
                    'Authorization': token,
                }
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not match the needed data'
            }
            res.status(402).json(err);
        }
	}



	async getAccounts(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            // const urlBase = 'http://localhost:8080';


            const token = 'Bearer ' + req.headers['access_token'];
            const contactsByAccounts = '/services/data/v58.0/query/?q=SELECT+Id+,+Name+,+(+SELECT+Id+,+Name+,+Email+FROM+Contacts+)+FROM+Account';
            axios({ 
                method: 'GET',
                baseURL: urlBase,
                url: contactsByAccounts,
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'application/json',
                    'url': req.headers['url'],
                },
            })
            .then(response => {
                res.status(200).json(response.data);
            })
            .catch(err => {  res.status(500).json(err); });
        }
	}


	async getContacts(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {
            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;

            const token = 'Bearer ' + req.headers['access_token'];

            axios({ 
                method: 'GET',
                baseURL: urlBase,
                url: '/services/data/v58.0/sobjects/Contact/',
                headers: { 
                    'Authorization': token,
                    'url': req.headers['url'],
                },
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not match the needed data'
            }
            res.status(402).json(err);
        }

	}


	async createAccount(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const formdata = new FormData();
            formdata.append('Name', req.body['Name']);

            axios({ 
                method: 'POST',
                baseURL: urlBase,
                url: '/services/data/v58.0/sobjects/Account',
                responseType: 'json',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token, 
                    'url': req.headers['url'],
                },
                data: formdata
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not match the needed data'
            }
            res.status(402).json(err);
        }
	}


	async createContact(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];

            const formdata = new FormData();
            formdata.append('AccountId', req.body['AccountId']);
            formdata.append('FirstName', req.body['FirstName']);
            formdata.append('LastName', req.body['LastName']);
            formdata.append('Phone', req.body['Phone']);
            formdata.append('Email', req.body['Email']);

            axios({ 
                method: 'POST',
                baseURL: urlBase,
                url: '/services/data/v58.0/sobjects/Contact',
                responseType: 'json',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'url': req.headers['url'],
                },
                data: formdata
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);
        }
	}


	async editAccount(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const url = '/services/data/v58.0/sobjects/Account/' + req.body['AccountId'];

            const formdata = new FormData();
            formdata.append('Name', req.body['Name']);

            axios({ 
                method: 'PATCH',
                baseURL: urlBase,
                url: url,
                responseType: 'json',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'url': req.headers['url'],
                },
                data: formdata
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);
        }

	}


	async editContact(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const url = '/services/data/v58.0/sobjects/Contact/' + req.body['ContactId'];

            const formdata = new FormData();
            formdata.append('FirstName', req.body['FirstName']);
            formdata.append('LastName', req.body['LastName']);
            formdata.append('Phone', req.body['Phone']);
            formdata.append('Email', req.body['Email']);

            axios({ 
                method: 'PATCH',
                baseURL: urlBase,
                url: url,
                responseType: 'json',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'url': req.headers['url'],
                },
                data: formdata
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);
        }

	}


	async deleteAccount(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const url = '/services/data/v58.0/sobjects/Account/' + req.body['AccountId'];

            axios({ 
                method: 'DELETE',
                baseURL: urlBase,
                url: url,
                responseType: 'json',
                headers: { 
                    'Authorization': token,
                    'url': req.headers['url'],
                }
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);  
        }

	}



	async deleteContact(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const url = '/services/data/v58.0/sobjects/Contact/' + req.body['ContactId'];

            axios({ 
                method: 'DELETE',
                baseURL: urlBase,
                url: url,
                responseType: 'json',
                headers: { 
                    'Authorization': token,
                    'url': req.headers['url'],
                }
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {     res.status(500).json(err); });
        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);
        }
	}


    async sendEmails(req, res) {

        if (req.headers['url'] && req.headers['access_token']) {

            const jsonFile = JSON.parse(fs.readFileSync('./secure-files/data.json', 'utf8'));
            const urlBase = jsonFile.URL_TUNEL;
            const token = 'Bearer ' + req.headers['access_token'];
            const urlEmail = '/services/data/v58.0/actions/standard/emailSimple';

            const requirements = {
                "inputs": [
                    {
                        "emailBody": req.body.emailBody,
                        "emailAddresses": req.body.emailAddresses,
                        "emailSubject": req.body.emailSubject,
                        "sendRichBody": true
                    }
                ]
            };
            const bodyFinal = JSON.stringify(requirements);

            axios({ 
                method: 'POST',
                baseURL: urlBase,
                url: urlEmail,
                headers: {
                    'Authorization': token,
                    'url': req.headers['url'],
                    'Content-Type': 'application/json'
                },
                data: bodyFinal,
            })
            .then(response => { res.status(200).json(response.data);})
            .catch(err => {  res.status(500).json(err); });

        }
        else {
            const err = {
                type: 'NOT_ENOUGH_DATA',
                message: 'Request headers or body does not reach the needed data'
            }
            res.status(402).json(err);
        }

    }


    async convertSpeechToIA(req,res) {
        let content =  req.body.content;
        let peticion = req.body.peticion;

        //Inicio Procesamiento del audio en el bucket
        const buffer = Buffer.from(content, 'base64');
        const createFileLocal = new CreateFileLocal();
        const deleteFileLocal = new DeleteFileLocal();
        const uploadFileInABucket = new UploadFileInABucket();
        const speechToText = new SpeechToText();

        const fileName = createFileLocal.invoke(buffer);
        await uploadFileInABucket.invoke(fileName);
        deleteFileLocal.invoke(fileName);
        const transcrito = await speechToText.handleRequestSpeechToText(fileName);

        if( transcrito == "Ha ocurrido un error" ) {
            const err = {
                type: 'ERROR',
                message: 'Unexpected error'
            }
            res.status(500).json(err);

        } else if (transcrito != "Ha ocurrido un error") {
            
            const peticionCompleta = peticion + transcrito;

            const openAi = new OpenAi();
            let responseIa = await openAi.handleRequestOpenAi(peticionCompleta);
            if (responseIa.length > 0) {
                res.status(200).json(responseIa);
            }
            else {
                res.status(500).json(responseIa);
            }
        }
    }


    async convertSpeechToIA2(req,res) {

        const speechToText = new SpeechToText();
        const fileName = "aDUqvgmc3IPAW7V0u19vxsaseU5pCxXR.wav";
        // const fileName = "MaaB0b8fBZppKtY6I5nOYQH6SDZEZJqV.wav";
        const transcrito = await speechToText.handleRequestSpeechToText2(fileName);

        if( transcrito == "Ha ocurrido un error" ) {
            const err = {
                type: 'ERROR',
                message: 'Unexpected error'
            }
            res.status(500).json(err);

        } else if (transcrito != "Ha ocurrido un error") {

            res.status(200).json({transcrito: transcrito});
            
            // const peticionCompleta = peticion + " " + transcrito;

            // const openAi = new OpenAi();
            // let responseIa = await openAi.handleRequestOpenAi(peticionCompleta);
            // if (responseIa.length > 0) {
            //     res.status(200).json(responseIa);
            // }
            // else {
            //     res.status(500).json(responseIa);
            // }
        }
    }

}


module.exports = { SalesforceController }
