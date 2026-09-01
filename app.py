import os
import json
import random
from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify, redirect, url_for, session

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "sahakarigig-secret-key-sih-2026")

# -------------------------------------------------------------
# Mock Database / Seed Data
# -------------------------------------------------------------

SERVICES = [
    {
        "id": "elec-01",
        "title": "Full Home Electrical Safety & Wiring Audit",
        "category": "electrical",
        "category_name": "Electrical & Power",
        "icon": "fa-bolt",
        "badge_color": "emerald",
        "price": 699,
        "market_price": 1150,
        "duration": "60-90 mins",
        "rating": 4.9,
        "reviews_count": 348,
        "worker_share": 678,
        "welfare_share": 21,
        "description": "Comprehensive diagnostic check for short circuits, MCB testing, inverter wiring, and grounding safety with digital audit report.",
        "popular": True,
        "features": ["Infrared heat check for load", "Surge protector test", "Child-safe switch verification", "Free 30-day Co-op warranty"]
    },
    {
        "id": "elec-02",
        "title": "Smart Switch & Ceiling Fan Smartification",
        "category": "electrical",
        "category_name": "Electrical & Power",
        "icon": "fa-lightbulb",
        "badge_color": "emerald",
        "price": 449,
        "market_price": 750,
        "duration": "45 mins",
        "rating": 4.8,
        "reviews_count": 210,
        "worker_share": 435,
        "welfare_share": 14,
        "description": "Installation of IoT smart switch modules, heavy BLDC fans, and dimmer calibration.",
        "popular": False,
        "features": ["Neutral wire testing", "Wi-Fi app pairing support", "Neat conduit concealing"]
    },
    {
        "id": "plumb-01",
        "title": "Precision Leak Detection & Pipeline Unclogging",
        "category": "plumbing",
        "category_name": "Plumbing & Water",
        "icon": "fa-faucet-drip",
        "badge_color": "cyan",
        "price": 499,
        "market_price": 899,
        "duration": "45-60 mins",
        "rating": 4.9,
        "reviews_count": 512,
        "worker_share": 484,
        "welfare_share": 15,
        "description": "High-pressure hydro jetting and sonic sensor leak detection for concealed bathroom & kitchen pipes.",
        "popular": True,
        "features": ["Non-invasive sensor probe", "Heavy blockage snake clear", "O-ring & seal replacement", "Post-work dry clean"]
    },
    {
        "id": "plumb-02",
        "title": "Overhead Water Tank Deep Sanitization",
        "category": "plumbing",
        "category_name": "Plumbing & Water",
        "icon": "fa-water",
        "badge_color": "cyan",
        "price": 849,
        "market_price": 1400,
        "duration": "90 mins",
        "rating": 4.9,
        "reviews_count": 184,
        "worker_share": 823,
        "welfare_share": 26,
        "description": "6-stage German UV & pressure rotary tank cleaning removing sludge, algae, and bacterial buildup.",
        "popular": False,
        "features": ["Sludge extraction pump", "Anti-bacterial spray", "UV germicidal lamp scan"]
    },
    {
        "id": "clean-01",
        "title": "Eco-Friendly Deep Home Sanitation",
        "category": "cleaning",
        "category_name": "Home Cleaning",
        "icon": "fa-broom",
        "badge_color": "amber",
        "price": 1299,
        "market_price": 2200,
        "duration": "3-4 hrs",
        "rating": 4.9,
        "reviews_count": 620,
        "worker_share": 1260,
        "welfare_share": 39,
        "description": "Zero-toxic plant-based enzymatic cleaning for kitchens, tile grout, living rooms, and upholstery sanitization.",
        "popular": True,
        "features": ["Non-toxic pet-safe chemicals", "Steam sanitization at 140°C", "Window track grime removal", "2-person cooperative crew"]
    },
    {
        "id": "clean-02",
        "title": "Intensive Kitchen Oil & Chimney Degreasing",
        "category": "cleaning",
        "category_name": "Home Cleaning",
        "icon": "fa-kitchen-set",
        "badge_color": "amber",
        "price": 799,
        "market_price": 1350,
        "duration": "90 mins",
        "rating": 4.8,
        "reviews_count": 290,
        "worker_share": 775,
        "welfare_share": 24,
        "description": "Baffle filter acid-free decarbonization, motor rotor cleaning, and tile backsplash shine.",
        "popular": False,
        "features": ["Heavy carbon degreaser", "Duct inspection", "Stove burner unclogging"]
    },
    {
        "id": "appliance-01",
        "title": "Master AC Jet Servicing & Gas Top-Up",
        "category": "appliances",
        "category_name": "Appliance Repair",
        "icon": "fa-snowflake",
        "badge_color": "blue",
        "price": 549,
        "market_price": 999,
        "duration": "45 mins",
        "rating": 4.9,
        "reviews_count": 890,
        "worker_share": 532,
        "welfare_share": 17,
        "description": "High-velocity foam jacket pressure wash for indoor cooling coils and outdoor condenser cleaning.",
        "popular": True,
        "features": ["Foam coil wash", "Gas pressure PSI test", "Drain pipe anti-fungal flush", "Power consumption check"]
    },
    {
        "id": "appliance-02",
        "title": "Inverter Refrigerator & Washing Machine Tuning",
        "category": "appliances",
        "category_name": "Appliance Repair",
        "icon": "fa-blender-phone",
        "badge_color": "blue",
        "price": 499,
        "market_price": 850,
        "duration": "60 mins",
        "rating": 4.8,
        "reviews_count": 315,
        "worker_share": 484,
        "welfare_share": 15,
        "description": "PCB motherboard diagnosis, motor capacitor test, drum vibration dampening, and coil defrost fix.",
        "popular": False,
        "features": ["OEM spares guarantee", "Digital multimeter testing", "Transparent parts cost book"]
    },
    {
        "id": "carp-01",
        "title": "Custom Woodwork, Door Alignment & Furniture Fix",
        "category": "carpentry",
        "category_name": "Carpentry & Repairs",
        "icon": "fa-hammer",
        "badge_color": "orange",
        "price": 449,
        "market_price": 750,
        "duration": "60 mins",
        "rating": 4.9,
        "reviews_count": 270,
        "worker_share": 435,
        "welfare_share": 14,
        "description": "Hydraulic hinge replacements, squeaking door repairs, sliding wardrobe wheel calibration, and custom fittings.",
        "popular": False,
        "features": ["Precision laser level alignment", "Heavy duty screws included", "Clean sawdust vacuuming"]
    },
    {
        "id": "elder-01",
        "title": "Community Elder Assist & Tech Handyman",
        "category": "community",
        "category_name": "Community & Care",
        "icon": "fa-hands-holding-child",
        "badge_color": "rose",
        "price": 349,
        "market_price": 600,
        "duration": "60 mins",
        "rating": 5.0,
        "reviews_count": 412,
        "worker_share": 338,
        "welfare_share": 11,
        "description": "Vetted compassionate neighborhood assistants for heavy groceries lifting, smartphone/tablet troubleshooting, medicine organization, and mobility aid assembly.",
        "popular": True,
        "features": ["Police & Co-op Vetted Pro", "Patience-first certified", "Emergency contact syncing", "Compassion guarantee"]
    },
    {
        "id": "green-01",
        "title": "Solar Panel Cleaning & Terrace Garden Care",
        "category": "community",
        "category_name": "Community & Care",
        "icon": "fa-seedling",
        "badge_color": "emerald",
        "price": 599,
        "market_price": 1050,
        "duration": "75 mins",
        "rating": 4.9,
        "reviews_count": 165,
        "worker_share": 581,
        "welfare_share": 18,
        "description": "De-ionized water wash for rooftop solar photovoltaic arrays (+18% efficiency boost) and organic organic potting/pruning.",
        "popular": False,
        "features": ["Efficiency multimeter check", "Scratchless microfiber rotary", "Organic vermicompost blend"]
    }
]

WORKER_PROFILES = [
    {
        "id": "pro-101",
        "name": "Ramesh Kumar Sharma",
        "role": "Master Electrician & Solar Specialist",
        "category": "electrical",
        "experience": "12 Years",
        "rating": 4.94,
        "jobs_completed": 1420,
        "shares_owned": 142,
        "dividend_earned": 28400,
        "location": "Indiranagar (1.4 km away)",
        "badge": "Co-op Founding Steward",
        "avatar": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
        "vouched_by": 84,
        "status": "Available Now",
        "welfare_insured": True
    },
    {
        "id": "pro-102",
        "name": "Lakshmi Devi Murugan",
        "role": "Sanitation Lead & Deep Cleaning Expert",
        "category": "cleaning",
        "experience": "8 Years",
        "rating": 4.98,
        "jobs_completed": 980,
        "shares_owned": 98,
        "dividend_earned": 19600,
        "location": "Koramangala (2.1 km away)",
        "badge": "Quality Council Member",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "vouched_by": 112,
        "status": "Available in 20m",
        "welfare_insured": True
    },
    {
        "id": "pro-103",
        "name": "Arun Prakash V.",
        "role": "HVAC & Master Refrigeration Technician",
        "category": "appliances",
        "experience": "10 Years",
        "rating": 4.89,
        "jobs_completed": 1150,
        "shares_owned": 115,
        "dividend_earned": 23000,
        "location": "HSR Layout (0.8 km away)",
        "badge": "Peer Trainer",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "vouched_by": 67,
        "status": "Available Now",
        "welfare_insured": True
    },
    {
        "id": "pro-104",
        "name": "Suresh Patel",
        "role": "Hydro-Plumbing & Sewerage Specialist",
        "category": "plumbing",
        "experience": "14 Years",
        "rating": 4.92,
        "jobs_completed": 1670,
        "shares_owned": 167,
        "dividend_earned": 33400,
        "location": "BTM Layout (1.9 km away)",
        "badge": "Dispute Tribunal Member",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "vouched_by": 95,
        "status": "On Task (Free at 5 PM)",
        "welfare_insured": True
    }
]

GOVERNANCE_PROPOSALS = [
    {
        "id": "PROP-2026-08",
        "title": "Subsidize Electric 2-Wheeler Transition for 200 Co-op Members",
        "proposer": "Lakshmi Devi & Transport Working Group",
        "category": "Welfare & Sustainability",
        "status": "ACTIVE_VOTING",
        "yes_votes": 342,
        "no_votes": 28,
        "total_quorum_pct": 74,
        "deadline_hours": 36,
        "impact": "Allocates ₹1,20,000 from Q2 Co-op Surplus to provide zero-interest ₹15,000 EV battery down-payment subsidies, cutting worker fuel expenses by ₹2,400/month.",
        "badge": "High Priority"
    },
    {
        "id": "PROP-2026-09",
        "title": "Lower Platform Maintenance Reserve from 3.0% to 2.5% for Monsoon Months",
        "proposer": "Ramesh Kumar & Bangalore South Chapter",
        "category": "Fee Structure & Payouts",
        "status": "ACTIVE_VOTING",
        "yes_votes": 298,
        "no_votes": 64,
        "total_quorum_pct": 68,
        "deadline_hours": 58,
        "impact": "Increases direct worker take-home to 97.5% during July-September when seasonal household plumbing and cleaning surges occur.",
        "badge": "Economic Reform"
    },
    {
        "id": "PROP-2026-07",
        "title": "Approve Community Tool-Bank Depot at Sector 4 Community Hall",
        "proposer": "Arun Prakash V.",
        "category": "Shared Resources",
        "status": "PASSED_IMPLEMENTED",
        "yes_votes": 412,
        "no_votes": 12,
        "total_quorum_pct": 92,
        "deadline_hours": 0,
        "impact": "Purchased 4 heavy-duty core cutting machines and 6 thermal imaging sensors for shared free member checkout.",
        "badge": "Passed (97% Yes)"
    }
]

COMMUNITY_CAMPAIGNS = [
    {
        "id": "CAMP-01",
        "society_name": "Palm Meadows Resident Welfare Association (RWA)",
        "location": "Whitefield, Bangalore",
        "service_title": "Society-Wide Rooftop Solar & Tank Deep Sanitation",
        "discount_percent": 25,
        "current_pledges": 42,
        "target_pledges": 50,
        "regular_price_per_unit": 1400,
        "group_price_per_unit": 1050,
        "savings_total": 14700,
        "worker_crew_assigned": "Whitefield Co-op Pod (6 Specialists)",
        "days_left": 3,
        "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "CAMP-02",
        "society_name": "Sobha Moonstone Apartment Community",
        "location": "Bellandur Outer Ring Road",
        "service_title": "Pre-Monsoon Balcony Waterproofing & Drain Shield",
        "discount_percent": 20,
        "current_pledges": 28,
        "target_pledges": 30,
        "regular_price_per_unit": 950,
        "group_price_per_unit": 760,
        "savings_total": 5320,
        "worker_crew_assigned": "Bellandur Plumbing Guild",
        "days_left": 1,
        "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": "CAMP-03",
        "society_name": "Green Glen Layout Villa Association",
        "location": "HSR Sector 2",
        "service_title": "Comprehensive Air Conditioner Energy Optimization",
        "discount_percent": 30,
        "current_pledges": 64,
        "target_pledges": 60,
        "regular_price_per_unit": 999,
        "group_price_per_unit": 699,
        "savings_total": 19200,
        "worker_crew_assigned": "HSR HVAC Collective",
        "days_left": 5,
        "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80"
    }
]

LIVE_FEED_EVENTS = [
    {"time": "Just now", "text": "Sunil K. booked 'Master AC Jet Servicing' in HSR Layout", "icon": "fa-snowflake", "color": "text-sky-400"},
    {"time": "2 mins ago", "text": "Worker-Owner Ramesh K. received ₹678 direct instant payout (100% sans 3% welfare reserve)", "icon": "fa-wallet", "color": "text-emerald-400"},
    {"time": "4 mins ago", "text": "Palm Meadows RWA added 3 new pledges to Solar Cleaning drive", "icon": "fa-users", "color": "text-indigo-400"},
    {"time": "6 mins ago", "text": "Co-op Member Vote: 12 new ballots cast for EV Subsidies Proposal #08", "icon": "fa-check-to-slot", "color": "text-amber-400"},
    {"time": "9 mins ago", "text": "Emergency SOS Handyman arrived at Indiranagar within 13 mins", "icon": "fa-truck-fast", "color": "text-rose-400"}
]

# -------------------------------------------------------------
# Web Page Routes
# -------------------------------------------------------------

@app.route("/")
def index():
    categories = [
        {"id": "all", "name": "All Services", "icon": "fa-layer-group"},
        {"id": "electrical", "name": "Electrical & Power", "icon": "fa-bolt"},
        {"id": "plumbing", "name": "Plumbing & Water", "icon": "fa-faucet-drip"},
        {"id": "cleaning", "name": "Deep Cleaning", "icon": "fa-broom"},
        {"id": "appliances", "name": "Appliance Care", "icon": "fa-snowflake"},
        {"id": "carpentry", "name": "Carpentry", "icon": "fa-hammer"},
        {"id": "community", "name": "Community & Elder Care", "icon": "fa-hands-holding-child"}
    ]
    return render_template(
        "index.html",
        services=SERVICES,
        categories=categories,
        workers=WORKER_PROFILES,
        campaigns=COMMUNITY_CAMPAIGNS,
        proposals=GOVERNANCE_PROPOSALS[:2],
        live_feed=LIVE_FEED_EVENTS
    )

@app.route("/worker")
def worker_dashboard():
    active_worker = WORKER_PROFILES[0]  # Ramesh Kumar
    # Mock incoming radar gigs for worker
    radar_jobs = [
        {
            "id": "JOB-9021",
            "title": "Emergency Circuit Breaker Tripping Diagnostic",
            "customer": "Vikram Sethi",
            "distance": "1.2 km (Indiranagar 12th Main)",
            "payout": 678,
            "welfare_credit": 21,
            "time_estimate": "35 mins",
            "urgency": "High Urgency",
            "tags": ["Tools Ready", "Instant Payout", "Co-op Certified"]
        },
        {
            "id": "JOB-9022",
            "title": "Inverter Load Balancing & Smart Meter Calibration",
            "customer": "Ananya R.",
            "distance": "2.4 km (Defence Colony)",
            "payout": 850,
            "welfare_credit": 26,
            "time_estimate": "50 mins",
            "urgency": "Scheduled Today 5:30 PM",
            "tags": ["Pre-paid Escrow", "RWA Member"]
        }
    ]
    return render_template(
        "worker.html",
        worker=active_worker,
        radar_jobs=radar_jobs,
        proposals=GOVERNANCE_PROPOSALS
    )

@app.route("/governance")
def governance():
    treasury = {
        "total_revenue": 2485600,
        "worker_disbursed": 2411032,
        "welfare_fund_pool": 74568,
        "dividend_payout_fund": 45000,
        "healthcare_grants_paid": 32000,
        "tool_micro_loans_active": 18500,
        "member_count": 4200,
        "voter_turnout_pct": 78.4
    }
    return render_template(
        "governance.html",
        proposals=GOVERNANCE_PROPOSALS,
        treasury=treasury,
        workers=WORKER_PROFILES
    )

@app.route("/community")
def community():
    return render_template(
        "community.html",
        campaigns=COMMUNITY_CAMPAIGNS
    )

@app.route("/about")
def about():
    return render_template("about.html")

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------

@app.route("/api/services", methods=["GET"])
def get_services():
    category = request.args.get("category", "all")
    query = request.args.get("q", "").strip().lower()
    
    filtered = SERVICES
    if category != "all":
        filtered = [s for s in filtered if s["category"] == category]
    if query:
        filtered = [s for s in filtered if query in s["title"].lower() or query in s["description"].lower() or query in s["category_name"].lower()]
        
    return jsonify({"success": True, "count": len(filtered), "services": filtered})

@app.route("/api/book", methods=["POST"])
def book_service():
    data = request.json or {}
    service_id = data.get("service_id")
    customer_name = data.get("name", "Valued Community Member")
    phone = data.get("phone", "+91 98765 43210")
    address = data.get("address", "Indiranagar, Bangalore")
    time_slot = data.get("time_slot", "Immediate / Next Pro")
    notes = data.get("notes", "")

    service = next((s for s in SERVICES if s["id"] == service_id), SERVICES[0])
    matched_pro = random.choice(WORKER_PROFILES)
    
    booking_reference = f"SG-{random.randint(100000, 999999)}"
    
    response_data = {
        "success": True,
        "booking_id": booking_reference,
        "service": service,
        "customer": {"name": customer_name, "phone": phone, "address": address},
        "time_slot": time_slot,
        "matched_worker": matched_pro,
        "breakdown": {
            "total_price": service["price"],
            "worker_earnings_97pct": service["worker_share"],
            "welfare_fund_3pct": service["welfare_share"],
            "market_corporate_price": service["market_price"],
            "customer_savings": service["market_price"] - service["price"]
        },
        "estimated_arrival": "18 - 25 minutes",
        "message": f"Co-op Pro {matched_pro['name']} assigned! 97% of your ₹{service['price']} goes directly to them."
    }
    return jsonify(response_data)

@app.route("/api/sos", methods=["POST"])
def emergency_sos():
    data = request.json or {}
    service_type = data.get("service_type", "Electrical / Plumbing Emergency")
    location = data.get("location", "Indiranagar 100ft Road")
    contact = data.get("contact", "+91 99000 11223")

    assigned_pro = WORKER_PROFILES[0]
    sos_id = f"SOS-{random.randint(1000, 9999)}"

    return jsonify({
        "success": True,
        "sos_id": sos_id,
        "status": "DISPATCHED",
        "pro": assigned_pro,
        "estimated_eta": "12 minutes",
        "live_lat": 12.9716,
        "live_lng": 77.5946,
        "message": f"Rapid SOS dispatched! Master Pro {assigned_pro['name']} is 1.2km away and en route with emergency kit."
    })

@app.route("/api/governance/vote", methods=["POST"])
def cast_vote():
    data = request.json or {}
    proposal_id = data.get("proposal_id")
    vote_choice = data.get("choice")  # 'yes' or 'no'

    proposal = next((p for p in GOVERNANCE_PROPOSALS if p["id"] == proposal_id), None)
    if not proposal:
        return jsonify({"success": False, "error": "Proposal not found"}), 404

    if vote_choice == "yes":
        proposal["yes_votes"] += 1
    elif vote_choice == "no":
        proposal["no_votes"] += 1

    total_votes = proposal["yes_votes"] + proposal["no_votes"]
    yes_pct = round((proposal["yes_votes"] / total_votes) * 100, 1)

    return jsonify({
        "success": True,
        "proposal_id": proposal_id,
        "yes_votes": proposal["yes_votes"],
        "no_votes": proposal["no_votes"],
        "yes_pct": yes_pct,
        "message": f"Your democratic member vote '{vote_choice.upper()}' has been recorded on the Co-op Ledger!"
    })

@app.route("/api/community/join", methods=["POST"])
def join_campaign():
    data = request.json or {}
    campaign_id = data.get("campaign_id")
    flat_no = data.get("flat_no", "Tower B - 402")
    
    campaign = next((c for c in COMMUNITY_CAMPAIGNS if c["id"] == campaign_id), None)
    if not campaign:
        return jsonify({"success": False, "error": "Campaign not found"}), 404

    campaign["current_pledges"] += 1
    pct_reached = min(100, round((campaign["current_pledges"] / campaign["target_pledges"]) * 100))

    return jsonify({
        "success": True,
        "campaign_id": campaign_id,
        "current_pledges": campaign["current_pledges"],
        "target_pledges": campaign["target_pledges"],
        "pct_reached": pct_reached,
        "message": f"Added pledge for {flat_no}! Society discount tier activated."
    })

@app.route("/api/calculator", methods=["GET"])
def calculate_breakdown():
    amount = float(request.args.get("amount", 1000))
    corporate_fee_pct = 0.32  # 32% standard aggregator cut + surge
    coop_welfare_pct = 0.03   # 3% co-op pool

    corporate_worker_payout = amount * (1.0 - corporate_fee_pct)
    corporate_middleman_cut = amount * corporate_fee_pct

    coop_worker_payout = amount * (1.0 - coop_welfare_pct)
    coop_welfare_contribution = amount * coop_welfare_pct

    extra_worker_income = coop_worker_payout - corporate_worker_payout

    return jsonify({
        "order_amount": amount,
        "corporate": {
            "worker_payout": round(corporate_worker_payout, 2),
            "middleman_cut": round(middleman_cut if (middleman_cut := corporate_middleman_cut) else 0, 2),
            "worker_welfare_pool": 0,
            "worker_voice": "0% (Zero democratic votes)"
        },
        "sahakari_coop": {
            "worker_payout": round(coop_worker_payout, 2),
            "platform_middleman_cut": 0,
            "worker_welfare_pool": round(coop_welfare_contribution, 2),
            "worker_voice": "100% Democratic Co-op Ownership"
        },
        "extra_in_worker_pocket": round(extra_worker_income, 2),
        "percentage_gain_for_worker": f"+{round((extra_worker_income / corporate_worker_payout) * 100, 1)}%"
    })

# -------------------------------------------------------------
# App Runner
# -------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
