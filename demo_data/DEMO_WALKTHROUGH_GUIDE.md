# ArogyaSutra: Full Live Demo Plan & Feature Walkthrough

**Target Audience:** Hackathon Judges, Clinicians, Technical Evaluators  
**Demo Duration:** 7–10 minutes  
**Demo Personas:** 
1. **Rahul Sharma (Patient, 45M):** Chronic diabetic & hypertensive managing lifelong medical records.
2. **Dr. Priya Nair (Doctor, Cardiologist):** Treating physician accessing consented records.
3. **Emergency Medical Officer (ER Doctor):** First responder executing Break-Glass emergency access.
4. **Aadhya Sharma (Child Dependent, 7F):** Demonstrating Guardian Access mode.

---

## Act 1: The Patient Experience — Identity & Onboarding (2 min)
- **Goal:** Show seamless biometric/card issuance, zero-friction onboarding, and bilingual accessibility.
- **Steps:**
  1. **Launch App:** Open `http://localhost:3000`.
  2. **Language Toggle:** Switch between English and Hindi (हिन्दी) in Settings/Header to demonstrate regional localization for Bharat.
  3. **Patient Registration / Card Generation:** Show the issuance of the virtual 16-digit Health Card (`AS-7829-4510-6233`) and NFC/QR identity token.
  4. **Onboarding Wizard:** Show auto-population of address from 6-digit Pincode (`400050` -> Mumbai, Maharashtra) via Indian Postal API.
  5. **Guardian Mode:** Link dependent daughter Aadhya Sharma (`AS-3391-8820-1144`) under Rahul's account to demonstrate multi-generational family health tracking.

---

## Act 2: Document Ingestion & Med-Vision AI Pipeline (2.5 min)
- **Goal:** Prove end-to-end processing of messy, real-world Indian prescriptions and lab reports.
- **Steps:**
  1. **Scan Prescription:** Click floating action button `[+]` -> Select `demo_data/patient_rahul/prescriptions/rahul_diabetes_prescription.jpg`.
  2. **AI Extraction Review:** Observe AWS Bedrock Med-Vision extracting:
     - Document Type: `Prescription (RX)`
     - Medications: Metformin 500mg (1-0-1), Glimepiride 1mg (1-0-0), Amlodipine 5mg (0-0-1), Atorvastatin 10mg, Ecosprin 75mg.
     - Diagnoses: `T2DM`, `HTN Stage I`.
  3. **Client-Side Zero-Knowledge Encryption:** Watch console/network logs derive the AES-256-GCM key in the browser using PBKDF2 before payload upload (cloud backend only ever receives encrypted ciphertext).
  4. **Ingest Lab Report:** Upload `demo_data/patient_rahul/lab_reports/rahul_hba1c_lipid_panel.jpg`. Observe automatic extraction of HbA1c (7.8%) and lipid values.

---

## Act 3: Clinical Timeline & 3D Interactive Anatomical Twin (2 min)
- **Goal:** Display the intuitive visualization of longitudinal medical history.
- **Steps:**
  1. **Unified Timeline View:** Scroll through the timeline showing prescriptions, lab tests, ECG, and discharge summaries in unified chronological order. Filter by tags (`Rx`, `Lab`, `Imaging`, `Hospital`).
  2. **Interactive 3D Body Model:** Click on body regions (Heart, Pancreas, Chest) to filter historical health events linked directly to that anatomical organ.
  3. **Trend Analytics:** View longitudinal graphs showing glycemic drift (HbA1c progression from 9.2% in DKA discharge down to 7.8%).

---

## Act 4: Doctor-Patient Consented Access & Clinical RAG (2 min)
- **Goal:** Demonstrate cross-hospital interoperability without central data honeypots.
- **Steps:**
  1. **Doctor Portal (`/doctor`):** Dr. Priya Nair enters Rahul's Card ID `AS-7829-4510-6233` and requests access.
  2. **Patient OTP Verification:** Rahul receives one-time PIN `482910` and approves. The ephemeral session key decrypts Rahul's medical history in Dr. Priya's browser session.
  3. **Agentic Clinical Assistant (RAG Engine):**
     - Dr. Priya asks: *"What is this patient's history of drug allergies and glycemic control over the last 18 months?"*
     - RAG queries timeline embeddings and responds: *"Patient has documented severe allergy to Sulfonamides (documented during March 2025 DKA admission). HbA1c improved from 9.2% (March 2025) to 7.8% (September 2026) on Metformin + Glimepiride."*
  4. **Prescription & Note Writer:** Dr. Priya writes a consultation note and prescribes Telmisartan 40mg.

---

## Act 5: Life-Saving Break-Glass Protocol & Audit Trail (1.5 min)
- **Goal:** Show emergency bypass for unconscious patients with irreversible audit logging.
- **Steps:**
  1. **Emergency Mode (`/emergency`):** Simulate an unconscious patient brought into trauma ICU.
  2. **Break-Glass Activation:** Emergency doctor scans Rahul's card/NFC and enters Medical Council Reg `KA-28411`.
  3. **Critical Triage View:** Instant unencrypted display of:
     - **Blood Group:** `B+`
     - **Critical Allergies:** `SULFONAMIDES (Rash + Angioedema)` — alerts doctor NOT to administer Co-trimoxazole/Sulfonylureas.
     - **Active Medications & Emergency Contacts.**
  4. **Immutable Access Log:** Return to Rahul's patient dashboard -> Open **Access Logs (`/access-log`)**.
  5. Show tamper-evident log entry: *"Emergency Break-Glass accessed by Dr. Priya Nair (MCI: KA-28411) with GPS and device timestamp"*. Patient receives immediate alert.
