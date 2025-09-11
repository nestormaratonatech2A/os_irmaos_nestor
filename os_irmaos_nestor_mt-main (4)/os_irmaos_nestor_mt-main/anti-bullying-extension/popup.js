document.addEventListener('DOMContentLoaded', function() {
    const PASSWORD = 'osirmaos';
    
    const loginSection = document.getElementById('loginSection');
    const managementSection = document.getElementById('managementSection');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');
    const newWordInput = document.getElementById('newWordInput');
    const addWordBtn = document.getElementById('addWordBtn');
    const wordsList = document.getElementById('wordsList');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificar se já está logado
    chrome.storage.local.get(['isLoggedIn'], function(result) {
        if (result.isLoggedIn) {
            showManagementSection();
        }
    });

    // Login
    loginBtn.addEventListener('click', function() {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === PASSWORD) {
            chrome.storage.local.set({isLoggedIn: true});
            showManagementSection();
            errorMsg.style.display = 'none';
        } else {
            errorMsg.style.display = 'block';
            passwordInput.value = '';
        }
    });

    // Enter para fazer login
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Adicionar palavra
    addWordBtn.addEventListener('click', function() {
        const word = newWordInput.value.trim().toLowerCase();
        if (word) {
            chrome.storage.local.get(['blockedWords'], function(result) {
                const blockedWords = result.blockedWords || [];
                if (!blockedWords.includes(word)) {
                    blockedWords.push(word);
                    chrome.storage.local.set({blockedWords: blockedWords}, function() {
                        newWordInput.value = '';
                        loadWords();
                        // Notificar content script sobre a atualização
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            if (tabs[0]) {
                                chrome.tabs.sendMessage(tabs[0].id, {action: 'updateWords'});
                            }
                        });
                    });
                } else {
                    alert('Esta palavra já está na lista!');
                }
            });
        }
    });

    // Enter para adicionar palavra
    newWordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addWordBtn.click();
        }
    });

    // Limpar todas as palavras
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja remover todas as palavras bloqueadas?')) {
            chrome.storage.local.set({blockedWords: []}, function() {
                loadWords();
                // Notificar content script sobre a atualização
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'updateWords'});
                    }
                });
            });
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        chrome.storage.local.set({isLoggedIn: false});
        showLoginSection();
    });

    function showLoginSection() {
        loginSection.style.display = 'block';
        managementSection.style.display = 'none';
        passwordInput.value = '';
        errorMsg.style.display = 'none';
    }

    function showManagementSection() {
        loginSection.style.display = 'none';
        managementSection.style.display = 'block';
        loadWords();
    }

    function loadWords() {
        chrome.storage.local.get(['blockedWords'], function(result) {
            const blockedWords = result.blockedWords || [];
            wordsList.innerHTML = '';
            
            if (blockedWords.length === 0) {
                wordsList.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">Nenhuma palavra cadastrada ainda.</p>';
                return;
            }
            
            blockedWords.forEach(function(word) {
                const wordItem = document.createElement('div');
                wordItem.className = 'word-item';
                wordItem.innerHTML = `
                    <span>${word}</span>
                    <button onclick="removeWord('${word}')">Remover</button>
                `;
                wordsList.appendChild(wordItem);
            });
        });
    }

    // Função global para remover palavra
    window.removeWord = function(word) {
        chrome.storage.local.get(['blockedWords'], function(result) {
            const blockedWords = result.blockedWords || [];
            const updatedWords = blockedWords.filter(w => w !== word);
            chrome.storage.local.set({blockedWords: updatedWords}, function() {
                loadWords();
                // Notificar content script sobre a atualização
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'updateWords'});
                    }
                });
            });
        });
    };

    // Carregar palavras padrão na primeira instalação
    chrome.storage.local.get(['blockedWords', 'firstRun'], function(result) {
        if (!result.firstRun) {
            const defaultWords = [
                'idiota', 'burro', 'estúpido', 'feio', 'gordo', 'magro',
                'nerd', 'otário', 'loser', 'fracassado', 'lixo', 'inútil',
                'patético', 'ridículo', 'esquisito', 'anormal', 'deficiente',
                'retardado', 'mongol', 'aleijado', 'cego', 'surdo', 'mudo',
                'gay', 'viado', 'sapatão', 'bicha', 'traveco', 'aberração',
                'nojento', 'seboso', 'fedido', 'pobre', 'favelado', 'mendigo'
            ];
            
            chrome.storage.local.set({
                blockedWords: defaultWords,
                firstRun: true
            }, function() {
                if (managementSection.style.display !== 'none') {
                    loadWords();
                }
            });
        }
    });
});