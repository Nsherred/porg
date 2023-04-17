#!/bin/bash

usage() {
    cat << EOF
This script detects TLS secrets which refer to certificates that don't exist (anymore).
This is the case when error "unable to fetch certificate that owns the secret" occurs in cert-manager (cainjector) logs.
The reason is that a certificate has been removed without the secret being deleted.
The solution is to clean up by deleting any secret which belonged to a certificate that no longer exists.
Usage: $0 [-n namespace] [-v]
$0
    -n | --namespace <namespace>  (optional, default="istio-system")
    -v | --verbose                (optional)
    -h | --help                   (displays help and exits)
Examples:
Check the TLS secrets and matching certificates in the "istio-system" namespace, print only the end result
    $0
Check the TLS secrets and matching certificates in the "mynamespace" namespace, print only the end result
    $0 -n mynamespace
Check the TLS secrets and matching certificates in the "istio-system" namespace, print info about all TLS secrets and certificates
    $0 -v
EOF
}

namespace="istio-system"
printfLog='silentPrintf'

# Read commandline arguments
while [ "$1" != "" ]
do
    case $1 in
        -n | --namespace )
            shift
            namespace=$1
            ;;
        -v | --verbose )
            shift
            printfLog='printf'
            ;;
        -h | --help )
            usage
            exit
            ;;
        * )
            usage
            exit 1
    esac
    shift
done

# Don't print a string.
# This method is used when -v/--verbose is NOT specified. 
silentPrintf() {
    :
}

secrets_with_certificate_name=$(kubectl get secret -n $namespace -o jsonpath="{range .items[?(.type=='kubernetes.io/tls')]}{.metadata.name},{.metadata.annotations.cert-manager\.io/certificate-name} {end}")

$printfLog "Listing secrets (of type kubernetes.io/tls) with their annotated certificate:\n"
for i in ${secrets_with_certificate_name[@]}; do
    $printfLog "$i \n"
done

$printfLog "\nListing certificates:\n"
$printfLog "$(kubectl get certificate -n $namespace|awk '{print $1}'|grep -v "NAME")\n"

secrets_without_certs=("")

$printfLog "\nLooking for certificates matching the secrets:\n"
for secret_with_cert_name in ${secrets_with_certificate_name[@]}; do
    IFS="," read -a details <<< "$secret_with_cert_name"
    secret_name=${details[0]}
    cert=${details[1]}
    $printfLog "Secret $secret_name is made using cert $cert. Looking for that cert...\n"
    certmatch=$(kubectl get certificate -n $namespace -o jsonpath="{range .items[?(.metadata.name=='$cert')]}{.metadata.name} {end}")
    if [[ $certmatch == "" ]]; then
        secrets_without_certs+=("$secret_name")
        $printfLog "\n##### WARNING: Secret $secret_name has no matching certificate ($cert) and should be deleted. #####\n\n"
    else
        $printfLog "Certificate found.\n"
    fi
done

printf "\nAll secrets that have no matching certificates (and should therefore be cleaned up):\n"
for i in ${secrets_without_certs[@]}; do
    printf "%s \n", "$i"
done
