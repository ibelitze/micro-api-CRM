'use strict';
const axios = require("axios");
const fs = require('node:fs');

class DeleteFileLocal{   
    constructor() {
    }

	async invoke(nameWav) {
        fs.unlink(nameWav, (err) => {
			if (err) return false;
            return true;
        });
    } 
}

module.exports={DeleteFileLocal}