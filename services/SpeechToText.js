'use strict';
const axios = require("axios");
const fs = require('node:fs');
const {SpeechClient} = require('@google-cloud/speech');

class SpeechToText {
    constructor() {
    }

	async handleRequestSpeechToText(fileName) {
		try {
			const jsonFile  =  	JSON.parse(fs.readFileSync('./secure-files/data-speech-to-text.json', 'utf8'));
            const projectId         = jsonFile.PROJECT_ID;
            const bucketName        = jsonFile.BUCKET_NAME;
            const encoding          = jsonFile.ENCODING;
            const sampleRateHertz   = jsonFile.SAMPLERATEHERTZ;
            const languageCode      = jsonFile.LANGUAGE_CODE
            const keyFilename       = './secure-files/key_speechtotext.json';

            // url del archivo en el bucket
            const gcsUri = 'gs://'+bucketName+'/'+fileName;
            const audio = {uri: gcsUri};

            const config = {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            };

            const request = {
            	audio: audio,
            	config: config,
			};

            const client = new SpeechClient({
                projectId,
                keyFilename,
            });
            try {
              const [response] = await client.recognize(request);
              const transcription = response.results;
              return transcription[0]['alternatives'][0]['transcript'];   
            } 
			catch (error) {
                console.log(error)
                return "Ha ocurrido un error";
            }

		}
		catch (err) {
		  return 'Ha ocurrido un error';
		}
	}


    async handleRequestSpeechToText2(fileName) {
        try {
            const jsonFile  =   JSON.parse(fs.readFileSync('./secure-files/data-speech-to-text.json', 'utf8'));
            const projectId         = jsonFile.PROJECT_ID;
            const bucketName        = jsonFile.BUCKET_NAME;
            const encoding          = jsonFile.ENCODING;
            const sampleRateHertz   = jsonFile.SAMPLERATEHERTZ;
            const languageCode      = jsonFile.LANGUAGE_CODE
            const keyFilename       = './secure-files/key_speechtotext.json';

            // url del archivo en el bucket
            const gcsUri = 'gs://'+bucketName+'/'+fileName;
            const audio = {uri: gcsUri};

            const config = {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            };

            const request = {
                audio: audio,
                config: config,
            };

            const client = new SpeechClient({
                projectId,
                keyFilename,
            });
            try {
              const [response] = await client.recognize(request);
              const transcription = response.results;
              return transcription[0]['alternatives'][0]['transcript'];
            } 
            catch (error) {
                console.log(error)
                return "Ha ocurrido un error";
            }

        }
        catch (err) {
          return 'Ha ocurrido un error';
        }
    }
}

module.exports={SpeechToText}