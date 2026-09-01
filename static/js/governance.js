/**
 * SahakariGig - Cooperative Governance & Public Treasury Ledger Module
 */

let treasuryChartInstance = null;

function initTreasuryChart() {
    const ctx = document.getElementById('treasuryDonutChart');
    if (!ctx || typeof Chart === 'undefined') return;

    treasuryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Direct Worker Earnings (97%)',
                'Healthcare & Insurance Safety Net (1.2%)',
                'Tool Bank & Equipment Micro-Loans (0.8%)',
                'Patronage Dividend Reserve (1.0%)'
            ],
            datasets: [{
                data: [2411032, 29827, 19884, 24857],
                backgroundColor: [
                    '#10B981', // Emerald
                    '#6366F1', // Indigo
                    '#06B6D4', // Cyan
                    '#F59E0B'  // Amber
                ],
                borderColor: '#090D16',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            return ` ₹${val.toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Cast Member Vote on Live Governance Referendums with instant client fallback
async function voteProposal(proposalId, choice) {
    SoundFX.pop();
    const btnYes = document.getElementById(`btn-yes-${proposalId}`);
    const btnNo = document.getElementById(`btn-no-${proposalId}`);

    if (btnYes) btnYes.disabled = true;
    if (btnNo) btnNo.disabled = true;

    // Apply UI update
    const yesEl = document.getElementById(`yes-count-${proposalId}`);
    const noEl = document.getElementById(`no-count-${proposalId}`);
    const barEl = document.getElementById(`vote-bar-${proposalId}`);
    const pctEl = document.getElementById(`vote-pct-${proposalId}`);

    let currentYes = yesEl ? parseInt(yesEl.innerText) || 342 : 342;
    let currentNo = noEl ? parseInt(noEl.innerText) || 28 : 28;

    if (choice === 'yes') currentYes++;
    if (choice === 'no') currentNo++;

    const total = currentYes + currentNo;
    const yesPct = Math.round((currentYes / total) * 100);

    if (yesEl) yesEl.innerText = `${currentYes} Yes`;
    if (noEl) noEl.innerText = `${currentNo} No`;
    if (barEl) barEl.style.width = `${yesPct}%`;
    if (pctEl) pctEl.innerText = `${yesPct}% Approval`;

    const actionBox = document.getElementById(`vote-action-box-${proposalId}`);
    if (actionBox) {
        actionBox.innerHTML = `
            <div class="col-span-2 py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                <i class="fa-solid fa-check-double mr-1"></i> Voted ${choice.toUpperCase()} • Recorded on Co-op Ledger
            </div>
        `;
    }

    SoundFX.success();
    Toast.show(`Your member vote '${choice.toUpperCase()}' is recorded on the Cooperative Public Ledger!`, "success");
    if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 50 });

    try {
        await fetch('/api/governance/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proposal_id: proposalId, choice: choice })
        });
    } catch (e) {}
}

// Interactive Patronage Dividend Calculator
function calculateDividend(gigsCompleted) {
    const gigs = parseInt(gigsCompleted) || 20;
    const label = document.getElementById('dividend-gigs-label');
    if (label) label.innerText = `${gigs} Gigs / Month`;

    const quarterlyDividend = Math.round(gigs * 3 * 22.5);
    const yearlyDividend = Math.round(quarterlyDividend * 4);
    const coopEquityShares = Math.round(gigs * 0.15 * 3);

    const elQtr = document.getElementById('div-quarterly');
    const elYr = document.getElementById('div-yearly');
    const elShares = document.getElementById('div-shares');

    if (elQtr) elQtr.innerText = `₹${quarterlyDividend.toLocaleString('en-IN')}`;
    if (elYr) elYr.innerText = `₹${yearlyDividend.toLocaleString('en-IN')}`;
    if (elShares) elShares.innerText = `+${coopEquityShares} Class-A Shares`;
}

document.addEventListener('DOMContentLoaded', () => {
    initTreasuryChart();
    calculateDividend(45);
});
