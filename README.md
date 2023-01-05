# Secrets

Create secrets corresponding to .env file in [https://console.cloud.google.com/security/secret-manager/create?project=alwaysnft]

Make sure there is a service principle pointing at admin@alwaysnft.cloud for each secret

After deployment, make sure that the secrets are associated with the service in the Cloud Run page [https://console.cloud.google.com/run/detail/us-central1/mynftnotary/revisions?project=alwaysnft]

# Deploy
gcloud config set project alwaysnft

gcloud run deploy mynftnotary --source=. --region=us-central1 --allow-unauthenticated 

gcloud run services update myftnotary \
--set-secrets=authHeader=authHeader:latest,ipfsGateway=ipfsGateway:latest

 
