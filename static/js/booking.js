/**
 * SahakariGig - Booking & Fair Economy Calculator Module
 */

let currentSelectedService = null;
let currentBookingStep = 1;

// Mock pro list for client-side fallback
const MOCK_PROS = [
    {
        name: "Ramesh Kumar Sharma",
        role: "Master Electrician & Solar Specialist",
        rating: "4.94",
        jobs_completed: 1420,
        location: "Indiranagar (1.4 km away)",
        avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
    },
    {
        name: "Lakshmi Devi Murugan",
        role: "Sanitation Lead & Deep Cleaning Expert",
        rating: "4.98",
        jobs_completed: 980,
        location: "Koramangala (2.1 km away)",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        name: "Arun Prakash V.",
        role: "HVAC & Master Refrigeration Technician",
        rating: "4.89",
        jobs_completed: 1150,
        location: "HSR Layout (0.8 km away)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
];

// Fair Economy Comparison Calculator
function updateFairCalculator(amount) {
    const amt = parseFloat(amount) || 1000;
    const sliderLabel = document.getElementById('calc-amount-label');
    if (sliderLabel) sliderLabel.innerText = `₹${amt.toLocaleString('en-IN')}`;

    // Math:
    // Corporate Platform: 32% cut -> Worker gets 68%
    // SahakariGig: 3% Co-op Welfare/Insurance Pool -> Worker gets 97% directly
    const corpWorker = Math.round(amt * 0.68);
    const corpCut = Math.round(amt * 0.32);

    const coopWorker = Math.round(amt * 0.97);
    const coopWelfare = Math.round(amt * 0.03);

    const extraWorkerPocket = coopWorker - corpWorker;
    const gainPct = Math.round((extraWorkerPocket / corpWorker) * 100);

    // Update DOM elements if present
    const elCorpWorker = document.getElementById('calc-corp-worker');
    const elCorpCut = document.getElementById('calc-corp-cut');
    const elCoopWorker = document.getElementById('calc-coop-worker');
    const elCoopWelfare = document.getElementById('calc-coop-welfare');
    const elExtraGain = document.getElementById('calc-extra-gain');
    const elGainPct = document.getElementById('calc-gain-pct');

    if (elCorpWorker) elCorpWorker.innerText = `₹${corpWorker.toLocaleString('en-IN')}`;
    if (elCorpCut) elCorpCut.innerText = `₹${corpCut.toLocaleString('en-IN')}`;
    if (elCoopWorker) elCoopWorker.innerText = `₹${coopWorker.toLocaleString('en-IN')}`;
    if (elCoopWelfare) elCoopWelfare.innerText = `₹${coopWelfare.toLocaleString('en-IN')}`;
    if (elExtraGain) elExtraGain.innerText = `+₹${extraWorkerPocket.toLocaleString('en-IN')}`;
    if (elGainPct) elGainPct.innerText = `+${gainPct}% more income to worker`;

    // Update graphical progress bars
    const barCorp = document.getElementById('bar-corp-worker');
    const barCoop = document.getElementById('bar-coop-worker');
    if (barCorp) barCorp.style.width = '68%';
    if (barCoop) barCoop.style.width = '97%';
}

// Category Filter & Search
function selectCategory(category, btnElement) {
    SoundFX.pop();
    document.querySelectorAll('.cat-filter-btn').forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-white', 'shadow-lg', 'shadow-emerald-500/20', 'border-emerald-400');
        b.classList.add('bg-slate-800/80', 'text-slate-300', 'border-slate-700/60');
    });

    if (btnElement) {
        btnElement.classList.remove('bg-slate-800/80', 'text-slate-300', 'border-slate-700/60');
        btnElement.classList.add('bg-emerald-500', 'text-white', 'shadow-lg', 'shadow-emerald-500/20', 'border-emerald-400');
    }

    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterServices() {
    const q = document.getElementById('service-search').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.service-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const desc = card.getAttribute('data-desc').toLowerCase();
        const cat = card.getAttribute('data-category-name').toLowerCase();

        if (title.includes(q) || desc.includes(q) || cat.includes(q)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const noResults = document.getElementById('no-services-found');
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// Open Booking Modal Wizard
function openBookingModal(serviceData) {
    SoundFX.pop();
    currentSelectedService = serviceData;
    currentBookingStep = 1;

    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    // Populate Step 1
    document.getElementById('modal-service-title').innerText = serviceData.title;
    document.getElementById('modal-service-category').innerText = serviceData.category_name;
    document.getElementById('modal-service-desc').innerText = serviceData.description;
    document.getElementById('modal-service-price').innerText = `₹${serviceData.price}`;
    document.getElementById('modal-market-price').innerText = `₹${serviceData.market_price}`;
    document.getElementById('modal-worker-payout').innerText = `₹${serviceData.worker_share}`;
    document.getElementById('modal-welfare-share').innerText = `₹${serviceData.welfare_share}`;
    document.getElementById('modal-savings').innerText = `₹${serviceData.market_price - serviceData.price}`;

    showBookingStep(1);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBookingModal() {
    SoundFX.pop();
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function showBookingStep(step) {
    currentBookingStep = step;
    document.getElementById('booking-step-1').classList.toggle('hidden', step !== 1);
    document.getElementById('booking-step-2').classList.toggle('hidden', step !== 2);
    document.getElementById('booking-step-3').classList.toggle('hidden', step !== 3);

    // Indicator updates
    document.getElementById('step-dot-1').className = step >= 1 ? 'w-8 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-slate-700';
    document.getElementById('step-dot-2').className = step >= 2 ? 'w-8 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-slate-700';
    document.getElementById('step-dot-3').className = step >= 3 ? 'w-8 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-slate-700';
}

function proceedToStep2() {
    SoundFX.pop();
    showBookingStep(2);
}

// Submit Booking with graceful client fallback
async function confirmBooking() {
    if (!currentSelectedService) return;

    const name = document.getElementById('book-name').value.trim() || 'Co-op Customer';
    const phone = document.getElementById('book-phone').value.trim() || '+91 98450 11223';
    const address = document.getElementById('book-address').value.trim() || 'Indiranagar 100ft Road, Bangalore';
    const slot = document.getElementById('book-slot').value;
    const notes = document.getElementById('book-notes').value.trim();

    const submitBtn = document.getElementById('btn-confirm-booking');
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Matching Nearest Co-op Pro...`;
    submitBtn.disabled = true;

    // Pick pro
    const matchedPro = MOCK_PROS[Math.floor(Math.random() * MOCK_PROS.length)];
    const bookingRef = `SG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: currentSelectedService.id,
                name: name,
                phone: phone,
                address: address,
                time_slot: slot,
                notes: notes
            })
        });
        if (response.ok) {
            const res = await response.json();
            renderBookingConfirmation(res.booking_id, res.matched_worker, res.breakdown.total_price, res.breakdown.worker_earnings_97pct, res.breakdown.welfare_fund_3pct, res.estimated_arrival);
            return;
        }
    } catch (e) {
        // Handled below via fallback
    }

    // Client-side instant confirmation fallback
    setTimeout(() => {
        submitBtn.innerHTML = `Confirm & Reserve Pro`;
        submitBtn.disabled = false;
        renderBookingConfirmation(
            bookingRef,
            matchedPro,
            currentSelectedService.price,
            currentSelectedService.worker_share,
            currentSelectedService.welfare_share,
            "18 - 25 minutes"
        );
    }, 600);
}

function renderBookingConfirmation(bookingId, pro, totalPrice, workerShare, welfareShare, eta) {
    document.getElementById('conf-booking-id').innerText = bookingId;
    document.getElementById('conf-pro-name').innerText = pro.name;
    document.getElementById('conf-pro-role').innerText = pro.role;
    document.getElementById('conf-pro-avatar').src = pro.avatar;
    document.getElementById('conf-pro-rating').innerText = pro.rating;
    document.getElementById('conf-pro-jobs').innerText = `${pro.jobs_completed} jobs`;
    document.getElementById('conf-pro-distance').innerText = pro.location;
    document.getElementById('conf-eta').innerText = eta;
    document.getElementById('conf-total-paid').innerText = `₹${totalPrice}`;
    document.getElementById('conf-worker-earned').innerText = `₹${workerShare}`;
    document.getElementById('conf-welfare-credit').innerText = `₹${welfareShare}`;

    showBookingStep(3);
    SoundFX.success();
    Toast.show(`🎉 Booking ${bookingId} Confirmed! 97% credited to ${pro.name}`, 'success');

    if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
}

// Emergency SOS Trigger
function openSosModal() {
    SoundFX.sos();
    const modal = document.getElementById('sos-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeSosModal() {
    SoundFX.pop();
    const modal = document.getElementById('sos-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

async function triggerEmergencySos() {
    const sosBtn = document.getElementById('btn-sos-dispatch');
    sosBtn.innerHTML = `<i class="fa-solid fa-satellite-dish fa-spin mr-2"></i> Pinging Nearest Available Specialists...`;
    sosBtn.disabled = true;

    const assignedPro = MOCK_PROS[0];

    setTimeout(() => {
        sosBtn.innerHTML = `<i class="fa-solid fa-bolt mr-2"></i> SOS Rapid Dispatch Activated`;
        sosBtn.className = "w-full py-4 rounded-xl bg-emerald-500 text-white font-bold tracking-wide";

        document.getElementById('sos-status-box').classList.remove('hidden');
        document.getElementById('sos-pro-name').innerText = assignedPro.name;
        document.getElementById('sos-pro-role').innerText = assignedPro.role;
        document.getElementById('sos-pro-eta').innerText = "12 mins away";

        Toast.show(`🚨 Emergency Handyman ${assignedPro.name} dispatched! ETA: 12 mins`, 'sos', 6000);
    }, 800);
}
