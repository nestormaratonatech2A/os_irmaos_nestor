#!/bin/bash

# Script para gerar ícones PNG a partir do SVG
# Requer inkscape ou rsvg-convert

echo "Gerando ícones para a extensão OS IRMÃOS Anti-Bullying..."

cd "$(dirname "$0")"

# Verificar se temos as ferramentas necessárias
if command -v rsvg-convert >/dev/null 2>&1; then
    CONVERTER="rsvg-convert"
elif command -v inkscape >/dev/null 2>&1; then
    CONVERTER="inkscape"
else
    echo "Erro: É necessário instalar rsvg-convert ou inkscape para gerar os ícones PNG"
    echo "Ubuntu/Debian: sudo apt-get install librsvg2-bin"
    echo "              ou sudo apt-get install inkscape"
    exit 1
fi

# Gerar ícones em diferentes tamanhos
for size in 16 32 48 128; do
    echo "Gerando ícone ${size}x${size}..."
    
    if [ "$CONVERTER" = "rsvg-convert" ]; then
        rsvg-convert -w $size -h $size icon.svg > icon${size}.png
    else
        inkscape -w $size -h $size icon.svg -o icon${size}.png
    fi
done

echo "Ícones gerados com sucesso!"
echo "Arquivos criados:"
ls -la icon*.png 2>/dev/null || echo "Nenhum arquivo PNG encontrado - verifique se o conversor funcionou corretamente"
