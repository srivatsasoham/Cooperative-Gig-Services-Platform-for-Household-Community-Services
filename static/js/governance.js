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

// Cast Member Vote on Live Governance Referendums
async function voteProposal(proposalId, choice) {
    SoundFX.pop();
    const btnYes = document.getElementById(`btn-yes-${proposalId}`);
    const btnNo = document.getElementById(`btn-no-${proposalId}`);

    if (btnYes) btnYes.disabled = true;
    if (btnNo) btnNo.disabled = true;

    try {
        const response = await fetch('/api/governance/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proposal_id: proposalId, choice: choice })
        });
        const res = await response.json();

        if (res.success) {
            SoundFX.success();
            // Update vote counts and progress bar
            const yesEl = document.getElementById(`yes-count-${proposalId}`);
            const noEl = document.getElementById(`no-count-${proposalId}`);
            const barEl = document.getElementById(`vote-bar-${proposalId}`);
            const pctEl = document.getElementById(`vote-pct-${proposalId}`);

            if (yesEl) yesEl.innerText = `${res.yes_votes} Yes`;
            if (noEl) noEl.innerText = `${res.no_votes} No`;
            if (barEl) barEl.style.width = `${res.yes_pct}%`;
            if (pctEl) pctEl.innerText = `${res.yes_pct}% Approval`;

            const actionBox = document.getElementById(`vote-action-box-${proposalId}`);
            if (actionBox) {
                actionBox.innerHTML = `
                    <div class="py-2 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
                        <i class="fa-solid fa-check-double mr-1"></i> Voted ${choice.toUpperCase()} • Recorded on Co-op Ledger
                    </div>
                `;
            }

            Toast.show(res.message, "success");
            if (typeof confetti === 'function') {
                confetti({ particleCount: 50, spread: 50 });
            }
        }
    } catch (e) {
        Toast.show("Error submitting vote.", "error");
    }
}

// Interactive Patronage Dividend Calculator
function calculateDividend(gigsCompleted) {
    const gigs = parseInt(gigsCompleted) || 20;
    const label = document.getElementById('dividend-gigs-label');
    if (label) label.innerText = `${gigs} Gigs / Month`;

    // Formula:
    // Avg service revenue per gig = ₹650
    // Co-op 1% dividend pool share = ₹6.50 per gig + cooperative equity multiplier
    // Quarterly dividend payout = gigs * 3 months * ₹18.5 bonus share
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
