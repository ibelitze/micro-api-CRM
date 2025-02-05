'use strict';
const axios = require("axios");
const fs = require('node:fs');

class OpenAi{
    constructor() {}

	async handleRequestOpenAi(content) {
		try {
			const jsonFile  =  JSON.parse(fs.readFileSync('./secure-files/data-open-ai.json', 'utf8'));
			const baseUrl   =  jsonFile.BASE_URL
			const url = jsonFile.URL

			const response = await axios({
				method: 'POST',
				baseURL: baseUrl,
				url: url,
				responseType: 'json',
				data: { content: content }
			});

			const respuesta = response.data.message[0]["message"]["content"];
			return respuesta;
		} 
		
		catch (err) {
		  return 'Ha ocurrido un error';
		}
	} 
}

module.exports={OpenAi}