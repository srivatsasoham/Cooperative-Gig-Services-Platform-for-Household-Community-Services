# 🌟 SahakariGig (सहकारी Gig)
### *Cooperative Gig Services Platform for Household & Community Services*
**Developed for Smart India Hackathon (SIH)**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/framework-Flask-emerald.svg)](https://flask.palletsprojects.com/)
[![Azure App Service](https://img.shields.io/badge/cloud-Microsoft%20Azure%20(SihPro)-0078D4.svg)](https://azure.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview & Hackathon Problem Statement

In traditional gig economy platforms (e.g. Urban Company, Uber, TaskRabbit), gig workers face **20%–35% middleman commissions**, opaque algorithmic shadow-banning, and **zero social security**.

**SahakariGig** disrupts this extractive model through **Platform Cooperativism**:
1. **Worker-Owned Cooperative (97% Direct Take-Home)**: Workers receive 97% of every booking directly. Only 3% is pooled into the collective worker welfare fund.
2. **Democratic DAO Governance & Co-op Council**: Workers and community members vote on platform policies, commission rates, and dispute mediation (1 member = 1 vote).
3. **Collective Welfare, Insurance & Tool Bank**: 3% cooperative reserve fund powers health insurance (Ayushman integration), zero-interest tool replacement loans, and accident coverage.
4. **Resident Welfare Association (RWA) Group Buying**: Societies pool maintenance tasks (solar panel cleaning, AC tuneups, tank sanitation) for **20–30% group discounts** while workers get guaranteed full-day volume work.
5. **Emergency SOS Handyman Dispatch**: Guaranteed < 15 minute emergency handyman response for pipe bursts, power blackouts, and senior citizen assistance.
6. **Patronage Dividends**: 100% of platform surplus is returned quarterly to workers and community members.
7. **Multilingual & Voice-First**: High accessibility across Indian regional languages (English, Hindi, Kannada, Tamil).

---

## 🎨 System Architecture & Features

```
                   +-----------------------------------------------+
                   |     SahakariGig Platform Cooperativism UI    |
                   +-----------------------------------------------+
                     /              |             \            \
                    /               |              \            \
      +-----------------+  +-----------------+  +---------+  +---------+
      |  Consumer Hub   |  | Worker-Owner Hub|  | Co-op   |  | RWA     |
      |  - Instant Book |  | - Radar GPS Map |  | Council |  | Bulk Hub|
      |  - Fair Calc    |  | - Instant UPI   |  | - Voting|  | - Group |
      |  - 15m SOS      |  | - Welfare Claims|  | - Ledger|  |   Pledge|
      +-----------------+  +-----------------+  +---------+  +---------+
                                    |
                    +-------------------------------+
                    |     Python Flask REST API     |
                    |   (Dynamic Data & Services)   |
                    +-------------------------------+
                                    |
                    +-------------------------------+
                    |   Microsoft Azure App Service |
                    |      (SihPro Cloud Web App)   |
                    +-------------------------------+
```

---

## 💻 Quickstart Guide (Run Locally)

### 1. Clone Repository & Navigate
```bash
git clone https://github.com/srivatsasoham/Cooperative-Gig-Services-Platform-for-Household-Community-Services.git
cd Cooperative-Gig-Services-Platform-for-Household-Community-Services
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Flask Web Application
```bash
python app.py
```

Open your browser at: **`http://127.0.0.1:5000`**

---

## ☁️ Deploying to Microsoft Azure (`SihPro`)

Your Azure Web App `SihPro` (`sihpro-fhdcbudcbhf5dddw.centralindia-01.azurewebsites.net`) is ready to receive continuous deployments from GitHub:

### Option A: Azure Portal Deployment Center (Recommended - 2 Minutes)
1. Open the [Azure Portal](https://portal.azure.com/) and navigate to your Web App **`SihPro`**.
2. Click **Deployment Center** in the left sidebar.
3. Select **GitHub** as the source and authorize your GitHub account.
4. Select Organization: `srivatsasoham`
5. Select Repository: `Cooperative-Gig-Services-Platform-for-Household-Community-Services`
6. Select Branch: `main`
7. Click **Save**. Azure will automatically build and deploy the application!

### Option B: Download Publish Profile & GitHub Actions
1. On the Azure Portal overview page of **SihPro**, click **Download publish profile**.
2. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Create a new repository secret named `AZURE_WEBAPP_PUBLISH_PROFILE` and paste the contents of the downloaded publish profile file.
4. Git push to `main` to trigger `.github/workflows/azure-deploy.yml`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/services` | `GET` | Retrieve catalog with category filter (`?category=electrical`) and search (`?q=AC`) |
| `/api/book` | `POST` | Book cooperative pro with transparent 97%/3% price breakdown |
| `/api/sos` | `POST` | Trigger emergency rapid 15-minute handyman dispatch |
| `/api/governance/vote` | `POST` | Cast member democratic vote on cooperative proposals |
| `/api/community/join` | `POST` | Pledge apartment/flat to an active RWA bulk maintenance drive |
| `/api/calculator` | `GET` | Calculate earnings/savings comparison between Corporate vs. Co-op model |

---

## 👥 Hackathon Team & Credits
- **Topic**: *Cooperative Gig Services Platform for Household & Community Services*
- **Platform**: *SahakariGig (सहकारी Gig)*
- **Hackathon**: Smart India Hackathon (SIH)
- **License**: MIT
