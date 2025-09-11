# OS IRMÃOS - Extensão Anti-Bullying

## 🤝 Sobre a Extensão

A extensão **OS IRMÃOS - Anti-Bullying** é uma ferramenta desenvolvida para combater o bullying e cyberbullying na internet, promovendo empatia e conscientização sobre as consequências desse tipo de comportamento.

### ✨ Funcionalidades

- **🔒 Bloqueio Inteligente**: Detecta e bloqueia palavras relacionadas ao bullying e cyberbullying
- **🛡️ Proteção por Senha**: Acesso restrito ao gerenciamento com a senha "osirmaos"
- **📚 Conscientização**: Exibe popup educativo com informações legais e de conscientização
- **⚖️ Base Legal**: Inclui informações sobre leis brasileiras contra bullying e cyberbullying
- **🎯 Customização**: Permite adicionar e remover palavras da lista de bloqueio
- **🌟 Suporte**: Direciona usuários para o grupo "OS IRMÃOS" para ajuda

### 🎨 Design

- Ícone com dois meninos de mãos dadas simbolizando amizade e união
- Interface amigável e intuitiva
- Cores que transmitem confiança e segurança

## 📋 Pré-requisitos

- Navegador Google Chrome (versão 88 ou superior)
- Navegador Mozilla Firefox (versão 88 ou superior)
- Sistema operacional: Windows, macOS, Linux
- Dispositivos: Desktop e Mobile

## 🚀 Como Instalar

### Google Chrome

1. **Baixe os arquivos** da extensão ou clone este repositório
2. **Abra o Chrome** e digite `chrome://extensions/` na barra de endereços
3. **Ative o "Modo do desenvolvedor"** no canto superior direito
4. **Clique em "Carregar extensão sem compactação"**
5. **Selecione a pasta** `anti-bullying-extension`
6. A extensão será instalada e aparecerá na barra de ferramentas

### Mozilla Firefox

1. **Baixe os arquivos** da extensão
2. **Compacte a pasta** `anti-bullying-extension` em um arquivo .zip
3. **Abra o Firefox** e digite `about:debugging` na barra de endereços
4. **Clique em "Este Firefox"**
5. **Clique em "Carregar extensão temporária"**
6. **Selecione o arquivo** `manifest.json` na pasta da extensão

## 🔧 Como Usar

### Primeiro Acesso

1. **Clique no ícone** da extensão na barra de ferramentas
2. **Digite a senha**: `osirmaos`
3. **Clique em "Entrar"**

### Gerenciamento de Palavras

1. **Adicionar palavras**: Digite a palavra no campo e clique em "Adicionar"
2. **Remover palavras**: Clique no botão "Remover" ao lado da palavra
3. **Limpar todas**: Clique em "Limpar Todas" (requer confirmação)

### Funcionamento Automático

- A extensão monitora **automaticamente** todas as páginas web
- Quando uma palavra bloqueada é detectada:
  - A palavra é **substituída por símbolos** (●●●)
  - Um **popup educativo** é exibido
  - O usuário recebe **informações sobre as consequências** do bullying

## ⚖️ Base Legal

A extensão baseia-se nas seguintes leis brasileiras:

- **Lei nº 13.185/2015** - Programa de Combate à Intimidação Sistemática (Bullying)
- **Lei nº 14.811/2024** - Tipifica o cyberbullying como crime
- **Código Penal Brasileiro** - Artigos sobre injúria, difamação e calúnia
- **Marco Civil da Internet** - Responsabilização por conteúdo ofensivo

## 🆘 Canais de Ajuda

- **📞 Disque 100** - Direitos Humanos
- **📞 180** - Central de Atendimento à Mulher
- **📞 CVV 188** - Centro de Valorização da Vida
- **💻 SaferNet**: new.safernet.org.br
- **🤝 Grupo OS IRMÃOS** - Suporte especializado

## 🔒 Privacidade e Segurança

- **Dados locais**: Todas as informações ficam armazenadas localmente no navegador
- **Sem coleta**: Não coletamos dados pessoais dos usuários
- **Senha segura**: Acesso protegido por senha para evitar alterações não autorizadas
- **Código aberto**: Transparência total sobre o funcionamento

## 🎯 Palavras Padrão Bloqueadas

A extensão vem com uma lista padrão de palavras comumente usadas em situações de bullying:

- Termos depreciativos sobre aparência física
- Insultos relacionados à inteligência
- Palavras discriminatórias
- Termos ofensivos sobre características pessoais

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
anti-bullying-extension/
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface do popup
├── popup.css              # Estilos do popup
├── popup.js               # Lógica do popup
├── content.js             # Script de conteúdo
├── content.css            # Estilos do modal
├── background.js          # Script de fundo
├── icons/                 # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg
│   └── generate-icons.sh
└── README.md              # Documentação
```

### Tecnologias Utilizadas

- **HTML5**: Estrutura da interface
- **CSS3**: Estilos e animações
- **JavaScript ES6+**: Lógica da aplicação
- **Chrome Extension API**: Integração com o navegador
- **Web Extensions API**: Compatibilidade cross-browser

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👥 Equipe OS IRMÃOS

Desenvolvido com ❤️ pela equipe OS IRMÃOS, dedicada a criar um ambiente digital mais seguro e empático para todos.

---

## 📞 Contato

Para dúvidas, sugestões ou relatar problemas:

- **Email**: contato@osirmaos.org.br
- **Website**: www.osirmaos.org.br
- **Redes Sociais**: @osirmaos

---

**"Juntos somos mais fortes contra o bullying!"** 🤝✨
