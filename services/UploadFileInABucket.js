'use strict';
const {Storage} = require('@google-cloud/storage');
const fs = require('node:fs');
class UploadFileInABucket{   
    constructor() {
    }

	async invoke(nameWav) {
        try {

            const jsonFile                    =  JSON.parse(fs.readFileSync('./secure-files/data-speech-to-text.json', 'utf8'));
            const keyFilename                 = './secure-files/key_speechtotext.json';
            const projectId                   = jsonFile.PROJECT_ID;
            const bucketName                  = jsonFile.BUCKET_NAME;
            const filePath                    = nameWav;
            const generationMatchPrecondition = 0;
    
            const storage = new Storage({
                projectId,
                keyFilename,
            });
        
            const options = {
                destination: nameWav,
                preconditionOpts: {ifGenerationMatch: generationMatchPrecondition}
            };
    
            const response = await storage.bucket(bucketName).upload(filePath, options);
            return true;
        } catch (error) {
          return false;
        }


    } 
}

module.exports={UploadFileInABucket}