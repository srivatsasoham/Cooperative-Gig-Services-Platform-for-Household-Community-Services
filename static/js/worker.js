/**
 * SahakariGig - Worker-Owner Dashboard Module
 * Handles Live Radar Map, Instant Payouts, Job Dispatch Actions & Welfare Claims
 */

let workerMap = null;
let isOnline = true;
let currentWalletBalance = 4850;

function initWorkerRadarMap() {
    const mapEl = document.getElementById('worker-radar-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Center on Bangalore (e.g., Indiranagar / Koramangala)
    const workerLat = 12.9716;
    const workerLng = 77.6412;

    workerMap = L.map('worker-radar-map', {
        zoomControl: false,
        attributionControl: false
    }).setView([workerLat, workerLng], 14);

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(workerMap);

    // Custom Worker Marker
    const workerIcon = L.divIcon({
        className: 'custom-worker-pin',
        html: `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
                <i class="fa-solid fa-user-gear text-sm"></i>
                <div class="absolute inset-0 rounded-full bg-emerald-400 ping-circle opacity-75"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    L.marker([workerLat, workerLng], { icon: workerIcon })
        .addTo(workerMap)
        .bindPopup("<b>You (Ramesh K.)</b><br>Co-op Pro • Online")
        .openPopup();

    // Add 2 nearby Job Pins
    const jobIcon = L.divIcon({
        className: 'custom-job-pin',
        html: `
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 animate-bounce">
                <i class="fa-solid fa-bolt text-xs"></i>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });

    L.marker([12.9765, 12.9765 ? 77.6490 : 77.6490], { icon: jobIcon })
        .addTo(workerMap)
        .bindPopup("<b>Emergency Short Circuit</b><br>₹678 Take-home • 1.2km");

    L.marker([12.9640, 77.6350], { icon: jobIcon })
        .addTo(workerMap)
        .bindPopup("<b>Inverter Load Balancing</b><br>₹850 Take-home • 2.4km");
}

function toggleWorkerStatus() {
    isOnline = !isOnline;
    const btn = document.getElementById('btn-status-toggle');
    const badge = document.getElementById('status-live-badge');
    const radar = document.getElementById('radar-animation');

    if (isOnline) {
        btn.innerText = 'Go Offline';
        btn.className = 'px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30';
        badge.innerText = 'Online & Receiving Dispatches';
        badge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-2';
        if (radar) radar.style.display = 'block';
        Toast.show("🟢 You are Online. Live Co-op Radar active.", "success");
    } else {
        btn.innerText = 'Go Online';
        btn.className = 'px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30';
        badge.innerText = 'Offline (Resting)';
        badge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-600 flex items-center gap-2';
        if (radar) radar.style.display = 'none';
        Toast.show("⚪ Offline. No incoming dispatches.", "info");
    }
}

function acceptRadarJob(jobId, payoutAmount) {
    SoundFX.cash();
    const jobCard = document.getElementById(`job-card-${jobId}`);
    if (jobCard) {
        jobCard.innerHTML = `
            <div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center animate-fade-in">
                <i class="fa-solid fa-circle-check text-2xl text-emerald-400 mb-2"></i>
                <div class="text-sm font-bold text-emerald-300">Job Accepted & Dispatched!</div>
                <div class="text-xs text-slate-300 mt-1">Customer Vikram Sethi notified. Payout ₹${payoutAmount} locked in Co-op Escrow.</div>
                <button onclick="completeSimulatedJob('${jobId}', ${payoutAmount})" class="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600">
                    <i class="fa-solid fa-flag-checkered mr-1"></i> Mark as Completed
                </button>
            </div>
        `;
    }
    Toast.show(`⚡ Job ${jobId} Accepted! Route navigating via Co-op Map.`, "success");
}

function completeSimulatedJob(jobId, payoutAmount) {
    SoundFX.cash();
    currentWalletBalance += payoutAmount;
    
    // Update balance
    const walletEl = document.getElementById('worker-wallet-bal');
    if (walletEl) walletEl.innerText = `₹${currentWalletBalance.toLocaleString('en-IN')}`;

    const jobCard = document.getElementById(`job-card-${jobId}`);
    if (jobCard) {
        jobCard.remove();
    }

    if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60 });
    }
    Toast.show(`💰 ₹${payoutAmount} added to your Co-op Wallet! (Zero middleman fee)`, "success");
}

function openWithdrawModal() {
    SoundFX.pop();
    const modal = document.getElementById('withdraw-modal');
    if (modal) {
        document.getElementById('withdraw-amount').value = currentWalletBalance;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeWithdrawModal() {
    const modal = document.getElementById('withdraw-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function processWithdrawal() {
    const amt = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    const upi = document.getElementById('withdraw-upi').value || 'ramesh@upi';

    if (amt <= 0 || amt > currentWalletBalance) {
        Toast.show("Invalid withdrawal amount.", "error");
        return;
    }

    currentWalletBalance -= amt;
    const walletEl = document.getElementById('worker-wallet-bal');
    if (walletEl) walletEl.innerText = `₹${currentWalletBalance.toLocaleString('en-IN')}`;

    closeWithdrawModal();
    SoundFX.cash();
    Toast.show(`🚀 Instant Payout of ₹${amt} transferred to ${upi} via UPI Instant Disbursal!`, "success", 5000);
}

// Healthcare Welfare Claim
function openWelfareClaimModal() {
    SoundFX.pop();
    const modal = document.getElementById('welfare-claim-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeWelfareClaimModal() {
    const modal = document.getElementById('welfare-claim-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function submitWelfareClaim() {
    const claimType = document.getElementById('claim-type').value;
    const claimAmt = document.getElementById('claim-amount').value;
    closeWelfareClaimModal();
    SoundFX.success();
    Toast.show(`🛡️ Claim for ${claimType} (₹${claimAmt}) submitted to Co-op Peer Welfare Committee. Approved within 4 hrs!`, "success", 6000);
}

document.addEventListener('DOMContentLoaded', () => {
    initWorkerRadarMap();
});
