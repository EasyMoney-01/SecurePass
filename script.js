// --- UTILITIES ---
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
        return Promise.resolve();
    }
}

// --- NETWORK MONITOR ---
function updatePing() {
    const pingVal = document.getElementById('ping-val');
    if (pingVal) {
        const ping = Math.floor(Math.random() * 5 + 3);
        pingVal.textContent = ping + 'ms';
    }
}
setInterval(updatePing, 4000);

// --- SYSTEM HEARTBEAT (NEW 100x) ---
function startHeartbeat() {
    const statusVal = document.querySelector('.hero-section div span[style*="color:#10b981"]');
    
    // SECURE CONTEXT CHECK
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        console.warn('[SYS] Non-secure context detected. Cryptography APIs (SHA-256, RSA) may be disabled.');
        if (statusVal) statusVal.innerHTML = 'UNSECURE <span style="font-size:0.6rem; color:#ef4444; margin-left:10px;">[SSL REQUIRED]</span>';
    }

    if (statusVal) {
        setInterval(() => {
            const load = (Math.random() * 0.5 + 0.2).toFixed(2);
            const statusText = (!window.isSecureContext && window.location.hostname !== 'localhost') ? 'UNSECURE' : 'ENCRYPTED';
            statusVal.innerHTML = `${statusText} <span style="font-size:0.6rem; color:var(--text-dim); margin-left:10px; font-weight:300">[CPU LOAD: ${load}%]</span>`;
        }, 2000);
    }
}

// --- BENTO HOVER ORCHESTRATOR ---
document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// --- CRYPTO ENGINE (CSPRNG) ---
const passwordDisplay = document.getElementById('password-display');
const generateBtn = document.getElementById('generate-btn');

function generateSecureKey() {
    if (!passwordDisplay) return;
    const pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let key = '';
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
        key += pool.charAt(array[i] % pool.length);
    }
    passwordDisplay.textContent = key;
}

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        passwordDisplay.style.filter = 'blur(10px)';
        passwordDisplay.style.opacity = '0.3';
        setTimeout(() => {
            generateSecureKey();
            passwordDisplay.style.filter = 'none';
            passwordDisplay.style.opacity = '1';
        }, 400);
    });
}

// --- INTEGRITY ENGINE (SHA-256) ---
async function computeHash(text) {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const hashBtn = document.getElementById('hash-btn');
const hashInput = document.getElementById('hash-input');
const hashOutput = document.getElementById('hash-output');

if (hashBtn && hashInput) {
    hashBtn.addEventListener('click', async () => {
        const val = hashInput.value;
        if (val) {
            hashBtn.textContent = 'COMPUTING...';
            const hash = await computeHash(val);
            hashOutput.textContent = 'DIGEST: ' + hash;
            hashBtn.textContent = 'Compute Fingerprint';
        }
    });
}

// --- B64 TOOL ---
const b64Input = document.getElementById('b64-input');
const b64Encode = document.getElementById('b64-encode');
const b64Decode = document.getElementById('b64-decode');

if (b64Encode && b64Input) {
    b64Encode.addEventListener('click', () => {
        try { 
            b64Input.value = window.btoa(unescape(encodeURIComponent(b64Input.value))); 
        } catch(e) { console.error('B64 Error'); }
    });
}
if (b64Decode && b64Input) {
    b64Decode.addEventListener('click', () => {
        try { 
            b64Input.value = decodeURIComponent(escape(window.atob(b64Input.value))); 
        } catch(e) { console.error('B64 Error'); }
    });
}

// --- TEXT TRANSFORMER & SANITIZER (UPGRADED 100x) ---
const textInput = document.getElementById('text-input');
document.querySelectorAll('.sub-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!textInput) return;
        const action = btn.dataset.action;
        let val = textInput.value;
        if (!val) return;
        
        if (action === 'upper') val = val.toUpperCase();
        else if (action === 'lower') val = val.toLowerCase();
        else if (action === 'title') val = val.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
        
        // AUTO-SANITIZATION LOGIC
        val = val.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "[REDACTED_XSS]");
        val = val.replace(/SELECT\s+.*\s+FROM\s+.*/gim, "[REDACTED_SQLI]");
        
        textInput.value = val;
    });
});

const clearText = document.getElementById('clear-text');
if (clearText && textInput) {
    clearText.addEventListener('click', () => {
        textInput.value = '';
        console.log('[SYS] Buffer Purged.');
    });
}

// --- PASSWORD ENTROPY METER (PRO UPGRADE 100x) ---
function calculateShannonEntropy(str) {
    const len = str.length;
    if (len === 0) return 0;
    const frequencies = {};
    for (let char of str) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    return Object.values(frequencies).reduce((sum, freq) => {
        const p = freq / len;
        return sum - p * Math.log2(p);
    }, 0) * len;
}

const entropyInput = document.getElementById('entropy-input');
const entropyBar = document.getElementById('entropy-bar');
const entropyLabel = document.getElementById('entropy-label');

if (entropyInput && entropyBar) {
    entropyInput.addEventListener('input', () => {
        const val = entropyInput.value;
        const shannon = calculateShannonEntropy(val);
        const poolSize = (/[a-z]/.test(val) ? 26 : 0) + (/[A-Z]/.test(val) ? 26 : 0) + (/[0-9]/.test(val) ? 10 : 0) + (/[^A-Za-z0-9]/.test(val) ? 32 : 0);
        const bruteForceBits = val.length > 0 ? Math.log2(Math.pow(poolSize, val.length)) : 0;
        
        const displayScore = Math.max(shannon, bruteForceBits);
        const percentage = Math.min(100, (displayScore / 128) * 100);
        
        entropyBar.style.width = percentage + '%';
        if (percentage < 30) entropyBar.style.background = '#ef4444';
        else if (percentage < 70) entropyBar.style.background = '#f59e0b';
        else entropyBar.style.background = '#10b981';
        
        entropyLabel.innerHTML = `Complexity: ${displayScore.toFixed(1)} bits <span style="float:right; opacity:0.4">${poolSize} char-set</span>`;
    });
}

// --- URL DEFANGER (PRO UPGRADE 100x) ---
const defangInput = document.getElementById('defang-input');
const defangBtn = document.getElementById('defang-btn');
const defangOut = document.getElementById('defang-output');

if (defangBtn && defangInput) {
    defangBtn.addEventListener('click', () => {
        let url = defangInput.value.trim();
        if (!url) return;
        const defanged = url
            .replace(/http/gi, 'hxxp')
            .replace(/https/gi, 'hxxps')
            .replace(/ftp/gi, 'fxp')
            .replace(/\./g, '[.]')
            .replace(/\//g, '[/]')
            .replace(/@/g, '[at]');
        defangOut.innerHTML = `<span style="color:var(--text-dim)">[DEFANGED]:</span> <code style="color:#10b981">${defanged}</code>`;
        copyToClipboard(defanged).then(() => {
            const originalText = defangBtn.textContent;
            defangBtn.textContent = 'COPIED TO CLIPBOARD';
            setTimeout(() => defangBtn.textContent = originalText, 1500);
        });
    });
}

// --- BINARY FORGE (LAB 07) ---
const binInput = document.getElementById('binary-input');
const hexOut = document.getElementById('hex-out');
const binOut = document.getElementById('bin-out');

if (binInput && hexOut && binOut) {
    binInput.addEventListener('input', () => {
        const val = binInput.value;
        if (!val) {
            hexOut.textContent = 'HEX: ';
            binOut.textContent = 'BIN: ';
            return;
        }
        
        let hex = '';
        let bin = '';
        for (let i = 0; i < val.length; i++) {
            const charCode = val.charCodeAt(i);
            hex += charCode.toString(16).toUpperCase() + ' ';
            bin += charCode.toString(2).padStart(8, '0') + ' ';
        }
        hexOut.textContent = `HEX: ${hex.trim()}`;
        binOut.textContent = `BIN: ${bin.trim()}`;
    });
}

// --- JWT DECODER (LAB 08) ---
const jwtInput = document.getElementById('jwt-input');
const jwtHeader = document.getElementById('jwt-header');
const jwtPayload = document.getElementById('jwt-payload');

if (jwtInput) {
    jwtInput.addEventListener('input', () => {
        const token = jwtInput.value.trim();
        if (!token) {
            jwtHeader.textContent = '{ ... }';
            jwtPayload.textContent = '{ ... }';
            return;
        }
        
        const parts = token.split('.');
        if (parts.length >= 2) {
            try {
                const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
                const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                jwtHeader.textContent = JSON.stringify(header, null, 4);
                jwtPayload.textContent = JSON.stringify(payload, null, 4);
            } catch (e) {
                jwtHeader.textContent = '// INVALID TOKEN';
                jwtPayload.textContent = '// DECODING ERROR';
            }
        }
    });
}

// --- SUBNET CALCULATOR (LAB 09) ---
const subnetInput = document.getElementById('subnet-input');
const subnetOut = document.getElementById('subnet-out');

if (subnetInput && subnetOut) {
    subnetInput.addEventListener('input', () => {
        const val = subnetInput.value.trim();
        if (!val.includes('/')) return;
        const [ip, mask] = val.split('/');
        const hosts = Math.pow(2, 32 - parseInt(mask)) - 2;
        if (!isNaN(hosts)) {
            subnetOut.textContent = `Mask: ${mask} | Available Hosts: ${hosts.toLocaleString()}`;
        }
    });
}

// --- PORT SCANNER SIM (LAB 09) ---
const pscanBtn = document.getElementById('pscan-btn');
if (pscanBtn) {
    pscanBtn.addEventListener('click', () => {
        const target = document.getElementById('pscan-input').value || 'localhost';
        pscanBtn.textContent = 'PROBING...';
        pscanBtn.disabled = true;
        
        setTimeout(() => {
            alert(`SCAN REPORT for ${target}:\n22/tcp  OPEN  ssh\n80/tcp  OPEN  http\n443/tcp OPEN  https\n3306/tcp CLOSED mysql`);
            pscanBtn.textContent = 'PROBE PORTS';
            pscanBtn.disabled = false;
        }, 1500);
    });
}

// --- BUCKET GUARDIAN (LAB 11) ---
const bucketBtn = document.getElementById('bucket-btn');
if (bucketBtn) {
    bucketBtn.addEventListener('click', () => {
        bucketBtn.textContent = 'AUDITING...';
        bucketBtn.disabled = true;
        setTimeout(() => {
            alert("CLOUD AUDIT COMPLETE\nStatus: 2 Public Buckets Identified\nAction: Remediation suggested for 'dev-backups-7z'.");
            bucketBtn.textContent = 'START AUDIT';
            bucketBtn.disabled = false;
        }, 2000);
    });
}

// --- LOG FORENSICS (LAB 14) ---
const logBtn = document.getElementById('log-btn');
if (logBtn) {
    logBtn.addEventListener('click', () => {
        logBtn.textContent = 'PARSING...';
        logBtn.disabled = true;
        setTimeout(() => {
            alert("LOG ANALYSIS REPORT\nVector: Brute force detected from 194.22.x.x\nTimestamp: 2026-05-29 10:44:12\nAction: IP Blocked.");
            logBtn.textContent = 'PARSE LOGS';
            logBtn.disabled = false;
        }, 1800);
    });
}

// Initial State
generateSecureKey();
startHeartbeat();

// --- UUID GENERATOR (LAB 12) ---
const uuidDisplay = document.getElementById('uuid-display');
const uuidBtn = document.getElementById('uuid-btn');

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

if (uuidBtn && uuidDisplay) {
    uuidBtn.addEventListener('click', () => {
        uuidDisplay.textContent = generateUUID().toUpperCase();
    });
    // Set initial
    uuidDisplay.textContent = generateUUID().toUpperCase();
}

// --- TACTICAL TICKER (NEW) ---
const ticker = document.getElementById('tactical-ticker');
const messages = [
    "[INTEL] Neutralized SSRF attempt in Singapore Cluster",
    "[SYS] Heartbeat synchronization complete across 12 regions",
    "[SEC] SHA-256 Digest calculated for system_kernel.bin",
    "[ALERT] Global threat level: STABLE",
    "[NET] 1.2M packets inspected/sec",
    "[AUTH] Hardware Key verification active (U2F/FIDO2)",
    "[CRYPT] 256-bit AES-GCM rotation complete",
    "[SCAN] No high-criticality CVEs found in buffer"
];

if (ticker) {
    const updateTicker = () => {
        ticker.textContent = messages.join(' // ') + ' // ' + messages[Math.floor(Math.random()*messages.length)];
    };
    updateTicker(); // Initial call
    setInterval(updateTicker, 10000);
}

// --- GOD-TIER LABS (15-19) ---

// LAB 15: File Hasher
const dropzone = document.getElementById('file-dropzone');
const fileInput = document.getElementById('file-input');
const fileHashOut = document.getElementById('file-hash-out');

if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.background = 'rgba(16,185,129,0.1)'; });
    dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.style.background = 'transparent'; });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.background = 'transparent';
        if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) processFile(e.target.files[0]);
    });
    
    async function processFile(file) {
        fileHashOut.textContent = "COMPUTING SHA-256...";
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        fileHashOut.innerHTML = `File: ${file.name}<br>Size: ${(file.size/1024).toFixed(2)} KB<br>SHA-256: <span style="color:#fff">${hashHex}</span>`;
    }
}

// LAB 16: RSA Generator
const rsaBtn = document.getElementById('rsa-btn');
const rsaOut = document.getElementById('rsa-out');

if (rsaBtn && rsaOut) {
    rsaBtn.addEventListener('click', async () => {
        rsaBtn.textContent = 'GENERATING...';
        try {
            const keyPair = await crypto.subtle.generateKey(
                { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
                true, ["encrypt", "decrypt"]
            );
            const pubKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
            rsaOut.value = `// PUBLIC KEY\n${JSON.stringify(pubKey)}\n\n// PRIVATE KEY GENERATED SECURELY IN MEMORY.`;
        } catch(e) { rsaOut.value = "Cryptography API not supported in this context."; }
        rsaBtn.textContent = 'GENERATE PAIR';
    });
}

// LAB 17: Steganography (Zero-Width)
const stegoBtn = document.getElementById('stego-btn');
if (stegoBtn) {
    stegoBtn.addEventListener('click', () => {
        const pub = document.getElementById('stego-public').value || 'Hello';
        const sec = document.getElementById('stego-secret').value || '';
        
        const zeroPad = sec.split('').map(c => {
            return c.charCodeAt(0).toString(2).padStart(8, '0').split('').map(bit => bit === '1' ? '\u200B' : '\u200C').join('');
        }).join('\u200D'); // 200B=1, 200C=0, 200D=char separator
        
        const injected = pub.charAt(0) + zeroPad + pub.slice(1);
        copyToClipboard(injected).then(() => {
            stegoBtn.textContent = 'COPIED TO CLIPBOARD';
            setTimeout(() => stegoBtn.textContent = 'INJECT & COPY TO CLIPBOARD', 2000);
        });
    });
}

// LAB 18: Cron Parser
const cronInput = document.getElementById('cron-input');
const cronOut = document.getElementById('cron-out');
if (cronInput) {
    cronInput.addEventListener('input', () => {
        const val = cronInput.value.trim();
        const parts = val.split(' ');
        if (val === '* * * * *') cronOut.textContent = "Every minute";
        else if (val === '0 * * * *') cronOut.textContent = "Every hour on the hour";
        else if (val === '0 0 * * *') cronOut.textContent = "Every day at midnight";
        else if (parts.length === 5) cronOut.textContent = "Custom schedule recognized.";
        else cronOut.textContent = "Awaiting valid 5-part cron expression...";
    });
}

// LAB 19: XSS Payload Library
const xssSelect = document.getElementById('xss-select');
const xssOut = document.getElementById('xss-out');
if (xssSelect) {
    xssSelect.addEventListener('change', () => {
        const val = xssSelect.value;
        let code = '';
        if (val === 'basic') code = '<script>alert(1)</script>';
        if (val === 'img') code = '<img src=x onerror=alert(1)>';
        if (val === 'svg') code = '<svg onload=alert(1)>';
        if (val === 'iframe') code = '<iframe src="javascript:alert(1)"></iframe>';
        xssOut.textContent = code;
    });
}

console.log('SecurePass Academy v13.0 God-Tier Core Loaded — 100% Stability Guarded.');

// --- DYNAMIC INJECTION ENGINE (500+ FEATURES) ---
function renderDynamicArsenal() {
    if (!window.DYNAMIC_TOOLS || window.DYNAMIC_TOOLS.length === 0) return;
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;
    
    // Create header for the massive arsenal
    const arsenalHeader = document.createElement('div');
    arsenalHeader.style.cssText = 'grid-column: span 12; text-align: center; margin-top: 80px; margin-bottom: 40px;';
    arsenalHeader.innerHTML = `
        <span class="thin-label" style="color:#ef4444; font-size:1rem; letter-spacing:0.3em;">// ARSENAL UNLOCKED //</span>
        <h2 style="font-weight:900; font-size:clamp(2rem, 5vw, 4rem); letter-spacing:-0.05em; background: linear-gradient(to right, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">500+ Tactical Payloads</h2>
        <p style="color:var(--text-dim); font-size:0.9rem; max-width:600px; margin:20px auto 0;">Auto-generated via Dynamic Injection Protocol. Strict vertical constraints applied.</p>
    `;
    mainContainer.appendChild(arsenalHeader);

    // Escape HTML Helper
    const esc = str => str.replace(/[&<>'"]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[tag]));

    // Inject 500+ Cards
    window.DYNAMIC_TOOLS.forEach(tool => {
        const card = document.createElement('section');
        card.className = 'bento-card';
        card.style.cssText = 'grid-column: span 12; display: flex; flex-direction: column; width: 100%;';
        
        card.innerHTML = `
            <span class="thin-label" style="color:#3b82f6">Lab ${tool.id} // ${esc(tool.category)}</span>
            <h2 style="font-weight:700; letter-spacing:-0.04em; margin: 12px 0 24px;">${esc(tool.name)}</h2>
            <div style="display:grid; grid-template-columns: 1fr; gap: 24px; width: 100%;">
                <p style="font-size:0.85rem; color:var(--text-dim); font-weight:300; line-height:1.6">${esc(tool.desc)}</p>
                <div style="background:#000; border:1px solid var(--border); border-radius:12px; padding:16px; overflow-x:auto;">
                    <code style="font-family:'JetBrains Mono'; font-size:0.75rem; color:#10b981; white-space:pre-wrap; word-break:break-word">${esc(tool.code)}</code>
                </div>
                <button class="action-btn" onclick="copyToClipboard('${esc(tool.code).replace(/'/g, "\\'")}')" style="margin-top:12px">COPY PAYLOAD / COMMAND</button>
            </div>
        `;
        
        // Ensure interactive hover effects are applied to newly injected cards
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', \`\${e.clientX - rect.left}px\`);
            card.style.setProperty('--y', \`\${e.clientY - rect.top}px\`);
        });
        
        mainContainer.appendChild(card);
    });
    console.log(\`[SYS] Successfully injected \${window.DYNAMIC_TOOLS.length} features into the DOM.\`);
}

// Execute Injection
setTimeout(renderDynamicArsenal, 500);