'use strict';
const axios = require("axios");
const fs = require('node:fs');
const randomString = require('random-string');

class CreateFileLocal{   
    constructor() {
    }

	invoke(encode64Wav) {
		const buffer = Buffer.from(encode64Wav, 'base64');
		const nombre = randomString({
			length: 32,
			charset: 'alphanumeric'
		});

		const finalName = nombre+'.wav'
		
		fs.writeFile(finalName, buffer, (err) => {
		    if (err) return false;
	    }) 

		return finalName;
    } 
}

module.exports={CreateFileLocal}