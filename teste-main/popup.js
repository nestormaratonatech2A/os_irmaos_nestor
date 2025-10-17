// Inicializar senha de administrador (execute uma vez e remova depois)
setInitialAdminPassword('P10h2008G10@');
/**
 * Integração:
 * - Inclua o HTML do painel no popup.html.
 * - Inclua o CSS no popup.css.
 * - Adicione este JS ao popup.js.
 * - Chaves usadas no chrome.storage.sync: 'blockedSites', 'adminHash'
 * - Mensagens para background.js: {action: 'removeSite', domain}, {action: 'updateRules'}
 * - Para inicializar a senha: gere o hash SHA-256 da senha inicial e salve em 'adminHash' (veja função setInitialAdminPassword).
 * - Para redefinir senha, implemente fluxo seguro fora do popup.
 */

// Utilitário para SHA-256 (Web Crypto API)
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Inicialização do hash da senha (chame apenas uma vez, fora do popup, ou implemente fluxo seguro)
async function setInitialAdminPassword(password) {
  const hash = await sha256(password);
  chrome.storage.sync.set({adminHash: hash});
  // Remova esta função do popup após inicialização!
}

// Estado do painel
let adminAttempts = 0;
const MAX_ATTEMPTS = 5;
let cooldownTimeout = null;

// Abrir modal
document.getElementById('open-admin-modal').onclick = () => {
  document.getElementById('admin-modal').classList.remove('hidden');
  document.getElementById('admin-password').value = '';
  document.getElementById('admin-error').textContent = '';
  document.getElementById('blocked-sites-panel').classList.add('hidden');
};

// Cancelar/fechar modal
document.getElementById('admin-cancel-btn').onclick = () => {
  document.getElementById('admin-modal').classList.add('hidden');
  document.getElementById('admin-password').value = '';
  document.getElementById('admin-error').textContent = '';
  document.getElementById('blocked-sites-panel').classList.add('hidden');
  const ul = document.getElementById('blocked-sites-list');
  if (ul) ul.innerHTML = '';
  adminAttempts = 0;
  if (cooldownTimeout) clearTimeout(cooldownTimeout);
};

// Login de administrador
document.getElementById('admin-login-btn').onclick = async () => {
  const pwd = document.getElementById('admin-password').value;
  const errorMsg = document.getElementById('admin-error');
  if (cooldownTimeout) return;

  chrome.storage.sync.get(['adminHash'], async (data) => {
    const hash = data.adminHash;
    if (!hash) {
      errorMsg.textContent = 'Senha não configurada. Contate o desenvolvedor.';
      return;
    }
    const inputHash = await sha256(pwd);
    if (inputHash === hash) {
      errorMsg.textContent = 'Acesso concedido!';
      adminAttempts = 0;
      showBlockedSitesPanel();
    } else {
      adminAttempts++;
      errorMsg.textContent = 'Senha incorreta!';
      if (adminAttempts >= MAX_ATTEMPTS) {
        errorMsg.textContent = 'Muitas tentativas! Aguarde 30 segundos.';
        cooldownTimeout = setTimeout(() => {
          adminAttempts = 0;
          errorMsg.textContent = '';
          cooldownTimeout = null;
        }, 30000);
      }
    }
  });
};

// Exibe lista de sites bloqueados
function showBlockedSitesPanel() {
  document.getElementById('blocked-sites-panel').classList.remove('hidden');
  const ul = document.getElementById('blocked-sites-list');
  ul.innerHTML = '';
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = data.blockedSites || [];
    if (sites.length === 0) {
      ul.innerHTML = '<li>Nenhum site bloqueado.</li>';
      return;
    }
    sites.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const rmBtn = document.createElement('button');
      rmBtn.textContent = 'Remover';
      rmBtn.className = 'remove-btn';
      rmBtn.onclick = () => {
        removeBlockedSite(site);
      };
      li.appendChild(rmBtn);
      ul.appendChild(li);
    });
  });
}

// Remove site bloqueado
function removeBlockedSite(domain) {
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = (data.blockedSites || []).filter(s => s !== domain);
    chrome.storage.sync.set({blockedSites: sites}, () => {
      chrome.runtime.sendMessage({action: 'removeSite', domain});
      chrome.runtime.sendMessage({action: 'updateRules'});
      showBlockedSitesPanel();
      document.getElementById('admin-error').textContent = 'Site removido!';
      setTimeout(() => {
        document.getElementById('admin-error').textContent = '';
      }, 1500);
    });
  });
}
// Constantes
const ADMIN_PASSWORD = 'P10h2008G10@';

// Utilitário para extrair domínio
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Atualiza informações do popup com checagem de elementos e DOM pronto
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    const domain = getDomain(tab.url);
    const domainEl = document.getElementById('domain');
    if (domainEl) domainEl.textContent = domain;

    const statusEl = document.getElementById('status');
    chrome.storage.sync.get(['blockedSites'], (data) => {
      const sites = data.blockedSites || [];
      const blocked = sites.includes(domain);
      if (statusEl) {
        statusEl.textContent = blocked ? "Bloqueado neste site" : "Site liberado";
      } else {
        console.warn("Elemento com id 'status' não encontrado.");
      }
      const toggleBtn = document.getElementById('toggle-block');
      if (toggleBtn) {
        toggleBtn.textContent = blocked ? "Desbloquear" : "Bloquear";
        toggleBtn.onclick = () => {
          chrome.runtime.sendMessage({action: "toggleBlock", domain, block: !blocked}, () => {
            // Atualiza novamente após ação
            if (statusEl) statusEl.textContent = !blocked ? "Bloqueado neste site" : "Site liberado";
            toggleBtn.textContent = !blocked ? "Desbloquear" : "Bloquear";
          });
        };
      } else {
        console.warn("Elemento com id 'toggle-block' não encontrado.");
      }
    });
  });
});

// Adiciona site manualmente
document.getElementById('add-btn').onclick = () => {
  const input = document.getElementById('add-domain');
  const domain = input.value.trim();
  if (domain) {
    chrome.storage.sync.get(['blockedSites'], (data) => {
      const sites = data.blockedSites || [];
      if (!sites.includes(domain)) {
        sites.push(domain);
        chrome.storage.sync.set({blockedSites: sites}, () => {
          input.value = '';
          document.getElementById('count').textContent = `(${sites.length})`;
          updatePopup();
        });
      } else {
        input.value = '';
        alert('Domínio já bloqueado!');
      }
    });
  }
};

// Gerenciar sites bloqueados

// Expande/colapsa a seção de gerenciamento
document.getElementById('manage-btn').onclick = () => {
  const section = document.getElementById('manage-section');
  if (section.classList.contains('hidden')) {
    section.classList.remove('hidden');
    // Limpa campos ao abrir
    document.getElementById('admin-password').value = '';
    document.getElementById('blocked-list').classList.add('hidden');
    document.getElementById('sites-list').innerHTML = '';
  } else {
    section.classList.add('hidden');
  }
};

// Login de administrador
document.getElementById('admin-login').onclick = () => {
  const pwd = document.getElementById('admin-password').value;
  if (pwd === ADMIN_PASSWORD) {
    document.getElementById('blocked-list').classList.remove('hidden');
    renderBlockedList();
  } else {
    document.getElementById('blocked-list').classList.add('hidden');
    document.getElementById('sites-list').innerHTML = '';
    alert('Senha incorreta!');
  }
};

// Renderiza lista de sites bloqueados
function renderBlockedList() {
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = data.blockedSites || [];
    const ul = document.getElementById('sites-list');
    ul.innerHTML = '';
    sites.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const rmBtn = document.createElement('button');
      rmBtn.textContent = 'Remover';
      rmBtn.className = 'remove-btn';
      rmBtn.onclick = () => {
        chrome.storage.sync.get(['blockedSites'], (data) => {
          const newSites = (data.blockedSites || []).filter(s => s !== site);
          chrome.storage.sync.set({blockedSites: newSites}, () => {
            document.getElementById('count').textContent = `(${newSites.length})`;
            renderBlockedList();
          });
        });
      };
      li.appendChild(rmBtn);
      ul.appendChild(li);
    });
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', updatePopup);
