#!/usr/bin/env bash
set -e

DIRNAME=$(dirname "${0}")

# Install the cert-manager CRDs. We must do this before installing the Helm
# chart in the next step for `release-0.7` of cert-manager:
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.7/deploy/manifests/00-crds.yaml

# Install CertManager from the Jetstack Helm repository.
helm repo add jetstack https://charts.jetstack.io
helm upgrade cert-manager jetstack/cert-manager \
  --install \
  --namespace "cert-manager" \
  --values "./helm/values/cert-manager.yml"

# Wait for install to finish.
echo "Waiting for install to finish..."
sleep 30

# Create GCP DNS Admin Secret.
./gcloud/scripts/get-service-account-key.sh dns-admin
kubectl create secret generic cert-manager-credentials \
 --from-file "./gcloud/service-accounts/dns-admin.json" \
 --namespace "cert-manager"

# Create Staging and Production Issuers.
kubectl apply -f ./kubernetes/objects/cert-manager/
