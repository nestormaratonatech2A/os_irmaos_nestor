
function buildRules(sites) {
  return sites.map((site, idx) => ({
    id: idx + 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: site,
      resourceTypes: ["main_frame"]
    }
  }));
}

function updateRules() {
  chrome.storage.sync.get(['blockedSites'], (data) => {
    const sites = data.blockedSites || [];
    const rules = buildRules(sites);

    chrome.declarativeNetRequest.getDynamicRules((currentRules) => {
      const currentIds = currentRules.map(r => r.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: currentIds,
        addRules: rules
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(updateRules);
chrome.runtime.onStartup.addListener(updateRules);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.blockedSites) {
    updateRules();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "toggleBlock") {
    chrome.storage.sync.get(['blockedSites'], (data) => {
      let sites = data.blockedSites || [];
      const idx = sites.indexOf(msg.domain);
      if (msg.block && idx === -1) {
        sites.push(msg.domain);
      } else if (!msg.block && idx !== -1) {
        sites.splice(idx, 1);
      }
      chrome.storage.sync.set({ blockedSites: sites }, () => {
        updateRules();
        sendResponse({ success: true });
      });
    });
    return true;
  }
  if (msg.action === "addSite") {
    chrome.storage.sync.get(['blockedSites'], (data) => {
      let sites = data.blockedSites || [];
      if (!sites.includes(msg.domain)) {
        sites.push(msg.domain);
        chrome.storage.sync.set({ blockedSites: sites }, updateRules);
      }
      sendResponse({ success: true });
    });
    return true;
  }
  if (msg.action === "removeSite") {
    chrome.storage.sync.get(['blockedSites'], (data) => {
      let sites = data.blockedSites || [];
      const idx = sites.indexOf(msg.domain);
      if (idx !== -1) {
        sites.splice(idx, 1);
        chrome.storage.sync.set({ blockedSites: sites }, updateRules);
      }
      sendResponse({ success: true });
    });
    return true;
  }
});
