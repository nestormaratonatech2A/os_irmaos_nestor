// Background script para a extensão Anti-Bullying OS IRMÃOS

// Quando a extensão é instalada
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        // Configurações iniciais
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
            isLoggedIn: false,
            firstRun: true,
            installDate: new Date().toISOString()
        });
        
        console.log('OS IRMÃOS - Anti-Bullying Extension instalada com sucesso!');
    }
});

// Monitorar mudanças de aba para garantir que o content script seja carregado
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && 
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        
        // Verificar se o content script precisa ser recarregado
        chrome.tabs.sendMessage(tabId, {action: 'ping'}, function(response) {
            if (chrome.runtime.lastError) {
                // Content script não respondeu, pode precisar ser injetado
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).catch(err => {
                    // Ignorar erros silenciosamente (pode ser página restrita)
                });
            }
        });
    }
});

// Lidar com mensagens de content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getBlockedWords') {
        chrome.storage.local.get(['blockedWords'], function(result) {
            sendResponse({words: result.blockedWords || []});
        });
        return true; // Manter o canal de mensagem aberto
    }
    
    if (request.action === 'wordDetected') {
        // Log quando uma palavra é detectada (para estatísticas futuras)
        console.log('Palavra bloqueada detectada:', request.word, 'na URL:', sender.tab.url);
    }
});

// Manter estatísticas de uso (opcional)
chrome.storage.local.get(['statistics'], function(result) {
    const stats = result.statistics || {
        wordsBlocked: 0,
        pagesProcessed: 0,
        modalShown: 0
    };
    
    // Atualizar estatísticas quando necessário
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateStats') {
            if (request.type === 'wordBlocked') stats.wordsBlocked++;
            if (request.type === 'pageProcessed') stats.pagesProcessed++;
            if (request.type === 'modalShown') stats.modalShown++;
            
            chrome.storage.local.set({statistics: stats});
        }
    });
});

// Função para limpar storage se necessário (para debug)
function clearAllData() {
    chrome.storage.local.clear(function() {
        console.log('Todos os dados da extensão foram limpos');
    });
}

console.log('OS IRMÃOS - Background script carregado!');