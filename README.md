# opds2 search microservice

indexer micro-service

https://europe-west1-audiobooks-a6348.cloudfunctions.net/indexer

https://europe-west1-audiobooks-a6348.cloudfunctions.net/indexer?url=https://storage.googleapis.com/audiobook_edrlab/navigation/all.json&query=pergaud


## local quickstart

npm run start

https://github.com/GoogleCloudPlatform/functions-framework-nodejs


---

gcloud functions deploy indexer --runtime nodejs14 --trigger-http --allow-unauthenticated --region=europe-west1
