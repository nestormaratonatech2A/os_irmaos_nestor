
# Bloqueador de Sites Personalizado

Extensão para Google Chrome (Manifest V3) que permite bloquear sites de forma personalizada, com interface moderna, painel seguro de administração e controle por senha.

## Funcionalidades
- Bloqueia/desbloqueia sites definidos pelo usuário.
- Interface popup responsiva, limpa e intuitiva.
- Mostra domínio atual, status de bloqueio e contador de sites bloqueados.
- Permite adicionar domínios manualmente à lista de bloqueio.
- Painel oculto de administração para visualizar/remover sites bloqueados (acesso por senha).
- Modal seguro para autenticação do administrador, com campo de senha, feedback de erro/sucesso e bloqueio após 5 tentativas (cooldown).
- Senha protegida por hash SHA-256 usando Web Crypto API, armazenada em `chrome.storage.sync`.
- Remoção de sites atualiza o armazenamento e envia mensagens para o background atualizar as regras de bloqueio.
- Cores suaves e botões arredondados: fundo azul claro, botões azul escuro.

## Como instalar
1. Baixe ou clone este repositório.
2. No Chrome, acesse `chrome://extensions`.
3. Ative o "Modo de desenvolvedor" (canto superior direito).
4. Clique em "Carregar sem compactação" e selecione a pasta do projeto.

## Como usar
- Clique no ícone da extensão para abrir o popup.
- Para bloquear/desbloquear o site atual, use o botão correspondente.
- Para adicionar um domínio manualmente, digite no campo e clique em "Adicionar".
- Para gerenciar/remover sites bloqueados, clique em "Gerenciar sites bloqueados", digite a senha de administrador e acesse o painel seguro.
- Remova sites individualmente pelo painel (após autenticação).

## Estrutura dos arquivos
- `manifest.json`: Configuração da extensão.
- `background.js`: Gerencia regras de bloqueio.
- `popup.html`: Interface do popup e painel de administração.
- `popup.js`: Lógica do popup, autenticação e painel seguro.
- `popup.css`: Estilo visual e do modal.
- Ícones: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`.

## Segurança
- A senha de administrador é protegida por hash SHA-256 e nunca fica exposta em texto plano.
- Senha padrão inicial: `P10h2008G10@` (pode ser alterada com fluxo seguro).
- Após 5 tentativas incorretas, o painel bloqueia por 30 segundos.
- Recomenda-se remover a função de inicialização da senha do popup após o primeiro uso.

## Integração
- O painel oculto usa as chaves `blockedSites` e `adminHash` em `chrome.storage.sync`.
- Mensagens para o background: `{action: 'removeSite', domain}` e `{action: 'updateRules'}`.
- Para alterar a senha, implemente um fluxo seguro fora do popup.

## Licença
MIT