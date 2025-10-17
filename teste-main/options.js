const siteInput = document.getElementById('siteInput');
const addBtn = document.getElementById('addBtn');
const siteList = document.getElementById('siteList');

function renderList(sites) {
  siteList.innerHTML = '';
  sites.forEach((site, idx) => {
    const li = document.createElement('li');
    li.textContent = site;
    const rmBtn = document.createElement('button');
    rmBtn.textContent = 'Remover';
    rmBtn.onclick = () => removeSite(idx);
    li.appendChild(rmBtn);
    siteList.appendChild(li);
  });
}

function loadSites() {
  chrome.storage.sync.get(['blockedSites'], (data) => {
    renderList(data.blockedSites || []);
  });
}

function addSite() {
  const site = siteInput.value.trim();
  if (!site) return;
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = data.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.sync.set({ blockedSites: sites }, loadSites);
    }
    siteInput.value = '';
  });
}

function removeSite(idx) {
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = data.blockedSites || [];
    sites.splice(idx, 1);
    chrome.storage.sync.set({ blockedSites: sites }, loadSites);
  });
}

addBtn.onclick = addSite;
loadSites();
