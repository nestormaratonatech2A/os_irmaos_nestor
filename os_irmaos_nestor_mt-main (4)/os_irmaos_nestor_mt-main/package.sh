#!/bin/bash

# Script para empacotar a extensão OS IRMÃOS Anti-Bullying
# Para uso no Chrome Web Store e Firefox Add-ons

echo "=== Empacotando Extensão OS IRMÃOS Anti-Bullying ==="

# Criar diretório de build se não existir
mkdir -p build

# Nome do arquivo zip
PACKAGE_NAME="os-irmaos-anti-bullying-extension-v1.0.zip"

echo "Criando pacote: $PACKAGE_NAME"

# Arquivos a serem incluídos no pacote
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
    "README.md"
)

# Remover pacote anterior se existir
rm -f "build/$PACKAGE_NAME"

# Criar o pacote zip
cd "$(dirname "$0")"
zip -r "build/$PACKAGE_NAME" "${FILES_TO_INCLUDE[@]}"

echo "✅ Pacote criado com sucesso: build/$PACKAGE_NAME"

# Mostrar informações do pacote
echo ""
echo "📦 Informações do Pacote:"
echo "========================"
ls -lh "build/$PACKAGE_NAME"

echo ""
echo "📋 Arquivos incluídos:"
echo "====================="
unzip -l "build/$PACKAGE_NAME"

echo ""
echo "🚀 Próximos Passos:"
echo "==================="
echo "1. Para Chrome Web Store:"
echo "   - Acesse: https://chrome.google.com/webstore/devconsole/"
echo "   - Faça upload do arquivo: build/$PACKAGE_NAME"
echo ""
echo "2. Para Firefox Add-ons:"
echo "   - Acesse: https://addons.mozilla.org/developers/"
echo "   - Faça upload do arquivo: build/$PACKAGE_NAME"
echo ""
echo "3. Para teste local:"
echo "   - Chrome: chrome://extensions/ > Carregar extensão sem compactação"
echo "   - Firefox: about:debugging > Carregar extensão temporária"

echo ""
echo "✨ Extensão empacotada com sucesso!"
