// Content script para detectar e bloquear palavras de bullying
let blockedWords = [];
let isModalOpen = false;

// Carregar palavras bloqueadas do storage
function loadBlockedWords() {
    chrome.storage.local.get(['blockedWords'], function(result) {
        blockedWords = result.blockedWords || [];
        processPage();
    });
}

// Processar toda a página em busca de palavras bloqueadas
function processPage() {
    if (isModalOpen) return;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Não processar scripts, styles ou elementos já processados
                const parent = node.parentElement;
                if (!parent || 
                    parent.tagName === 'SCRIPT' || 
                    parent.tagName === 'STYLE' ||
                    parent.classList.contains('anti-bullying-processed') ||
                    parent.closest('.anti-bullying-modal')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(processTextNode);
}

// Processar um nó de texto específico
function processTextNode(textNode) {
    if (!textNode.textContent || isModalOpen) return;

    let hasBlockedWord = false;
    let originalText = textNode.textContent;
    let newText = originalText;

    blockedWords.forEach(word => {
        const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
        if (regex.test(newText)) {
            hasBlockedWord = true;
            newText = newText.replace(regex, '●'.repeat(word.length));
        }
    });

    if (hasBlockedWord) {
        textNode.textContent = newText;
        textNode.parentElement.classList.add('anti-bullying-processed');
        showAntiBullyingModal();
    }
}

// Escapar caracteres especiais para regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Mostrar modal de conscientização
function showAntiBullyingModal() {
    if (isModalOpen) return;
    
    isModalOpen = true;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'anti-bullying-modal-overlay';
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'anti-bullying-modal';
    
    modal.innerHTML = `
        <div class="anti-bullying-modal-content">
            <div class="anti-bullying-header">
                <div class="anti-bullying-icon">🤝</div>
                <h1>⚠️ ATENÇÃO: PALAVRA BLOQUEADA DETECTADA</h1>
            </div>
            
            <div class="anti-bullying-message">
                <h2>🚫 BULLYING E CYBERBULLYING SÃO CRIMES!</h2>
                
                <p><strong>Você sabia que fazer bullying ou cyberbullying é considerado crime no Brasil?</strong></p>
                
                <div class="law-section">
                    <h3>📜 Base Legal:</h3>
                    <ul>
                        <li><strong>Lei nº 13.185/2015</strong> - Programa de Combate à Intimidação Sistemática (Bullying)</li>
                        <li><strong>Lei nº 14.811/2024</strong> - Tipifica o cyberbullying como crime</li>
                        <li><strong>Código Penal Brasileiro</strong> - Artigos sobre injúria, difamação e calúnia</li>
                        <li><strong>Marco Civil da Internet</strong> - Responsabilização por conteúdo ofensivo</li>
                    </ul>
                </div>
                
                <div class="empathy-section">
                    <h3>💙 Pratique a Empatia:</h3>
                    <p>Lembre-se de que por trás de cada tela existe uma pessoa real, com sentimentos reais. Suas palavras têm o poder de machucar profundamente ou de construir pontes de amizade e compreensão.</p>
                    
                    <p><strong>Em vez de atacar, que tal:</strong></p>
                    <ul>
                        <li>🤲 Oferecer ajuda e apoio</li>
                        <li>💬 Conversar com respeito e educação</li>
                        <li>🌟 Ser a mudança positiva que você gostaria de ver</li>
                        <li>🤝 Defender quem está sendo atacado</li>
                    </ul>
                </div>
                
                <div class="consequences-section">
                    <h3>⚖️ Consequências do Bullying/Cyberbullying:</h3>
                    <ul>
                        <li>🏛️ <strong>Legais:</strong> Multa, prisão, medidas socioeducativas</li>
                        <li>🎓 <strong>Educacionais:</strong> Suspensão, expulsão, advertências</li>
                        <li>💔 <strong>Psicológicas:</strong> Trauma para a vítima e para o agressor</li>
                        <li>👨‍👩‍👧‍👦 <strong>Familiares:</strong> Vergonha, decepção, problemas familiares</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <h3>🆘 Precisa de Ajuda?</h3>
                    <p><strong>Se você está sofrendo bullying ou cyberbullying, ou se conhece alguém que está passando por isso:</strong></p>
                    
                    <div class="help-contacts">
                        <p>📞 <strong>Disque 100</strong> - Direitos Humanos</p>
                        <p>📞 <strong>180</strong> - Central de Atendimento à Mulher</p>
                        <p>📞 <strong>CVV 188</strong> - Centro de Valorização da Vida</p>
                        <p>💻 <strong>SaferNet:</strong> new.safernet.org.br</p>
                    </div>
                </div>
                
                <div class="final-message">
                    <h2>🤝 Procure o Grupo OS IRMÃOS que eles podem te ajudar!</h2>
                    <p>Juntos somos mais fortes. A união faz a força contra o bullying!</p>
                </div>
            </div>
            
            <div class="anti-bullying-actions">
                <button id="closeModal" class="close-btn">Entendi - Vou Praticar a Empatia! 💙</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Adicionar event listener para fechar
    document.getElementById('closeModal').addEventListener('click', function() {
        document.body.removeChild(overlay);
        isModalOpen = false;
        
        // Reprocessar a página após um breve delay
        setTimeout(() => {
            processPage();
        }, 1000);
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            isModalOpen = false;
        }
    });
}

// Observer para detectar mudanças dinâmicas na página
const observer = new MutationObserver(function(mutations) {
    if (isModalOpen) return;
    
    let shouldProcess = false;
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && 
                    !node.classList.contains('anti-bullying-modal') &&
                    !node.closest('.anti-bullying-modal')) {
                    shouldProcess = true;
                    break;
                }
            }
        }
    });
    
    if (shouldProcess) {
        setTimeout(processPage, 100);
    }
});

// Escutar mensagens da extensão
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateWords') {
        loadBlockedWords();
    }
});

// Inicializar
loadBlockedWords();

// Observar mudanças na página
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Reprocessar quando a página for focada
window.addEventListener('focus', function() {
    setTimeout(processPage, 500);
});

console.log('OS IRMÃOS - Anti-Bullying Extension carregada e ativa!');
