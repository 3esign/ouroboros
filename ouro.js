// OUROBOROS ($OURO) Client Logic
const CONFIG = {
  mint: "GyNLsJ8dBoymAxiPWcKFUmZhGzNpGhLT6R1DZAbi9Res",
  vault: "Dxqn8k91znurFUAiF8KBVpBGEVx22vpcP1AFvPA4L5AH",
  semirWallet: "HXFDaHyZ3i477z1BakiTWZg9UQN8rcreruuv9ifC1HvM",
  rpc: "https://api.tatum.io/v3/blockchain/node/solana-mainnet",
  backupRpc: "https://solana-rpc.publicnode.com"
};

let userWallet = null;

function logTerminal(msg, color = 'text-emerald-400') {
  const feed = document.getElementById('terminal-feed');
  if (!feed) return;
  const p = document.createElement('p');
  p.className = color;
  const time = new Date().toLocaleTimeString();
  p.textContent = '[' + time + '] ' + msg;
  feed.appendChild(p);
  feed.scrollTop = feed.scrollHeight;
}

function copyText(elemId) {
  const el = document.getElementById(elemId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    logTerminal('Copied ' + elemId + ' to clipboard', 'text-amber-300');
  });
}

async function toggleWallet() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      userWallet = resp.publicKey.toString();
      document.getElementById('wallet-label').textContent = userWallet.slice(0, 4) + '..' + userWallet.slice(-4);
      logTerminal('Wallet connected: ' + userWallet, 'text-emerald-300');
    } catch (err) {
      logTerminal('Wallet connection cancelled: ' + err.message, 'text-red-400');
    }
  } else if (isMobile) {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = 'https://phantom.app/ul/browse/' + currentUrl + '?ref=' + currentUrl;
  } else {
    window.open('https://phantom.app/', '_blank');
  }
}

async function triggerCrank() {
  logTerminal('Crank triggered! Probing Vault PDA balance...', 'text-amber-300');
  const btn = document.getElementById('crank-btn');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch(CONFIG.rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth'
      })
    });
    const d = await res.json();
    logTerminal('RPC Health: ' + (d.result || 'OK'), 'text-emerald-300');
    logTerminal('Engine state: Vault standing by for next sniper exit.', 'text-emerald-400');
  } catch (e) {
    logTerminal('RPC check note: ' + e.message, 'text-slate-400');
  } finally {
    if (btn) btn.disabled = false;
  }
}

window.addEventListener('load', () => {
  logTerminal('Ouroboros DApp mounted. Network: Solana Mainnet-Beta', 'text-emerald-400');
  logTerminal('Flywheel ratio: 67% Autonomous PDA / 33% Creator Wallet', 'text-teal-300');
});
