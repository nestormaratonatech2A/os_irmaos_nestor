#!/bin/bash

# Script para empacotar a extensão OS IRMÃOS Anti-Bullying
echo "=== Empacotando Extensão OS IRMÃOS Anti-Bullying ==="

mkdir -p build
PACKAGE_NAME="os-irmaos-anti-bullying-extension-v1.0.zip"

echo "Criando pacote: $PACKAGE_NAME"

FILES_TO_INCLUDE=(
    "manifest.json"
    "popup.html"
    "popup.css"
    "popup.js"
    "content.js"
    "content.css"
    "background.js"
    "icons/icon16.png"
    "icons/icon32.png"
    "icons/icon48.png"
    "icons/icon128.png"
)

rm -f "build/$PACKAGE_NAME"
cd "$(dirname "$0")"
zip -r "build/$PACKAGE_NAME" "${FILES_TO_INCLUDE[@]}"

echo "✅ Pacote criado com sucesso: build/$PACKAGE_NAME"
ls -lh "build/$PACKAGE_NAME"
echo "✨ Extensão empacotada com sucesso!"