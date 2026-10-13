# 🩺 ArogyaSutra — Official Hackathon Demo Flow & Presenter Guide

> **Zero External API Calls** | **100% Local Ollama (`llama3.2:latest`)** | **Zero-Knowledge PBKDF2 Client-Side Cryptography**

This document contains the step-by-step instructions, exact data to copy-paste, and key talking points to deliver a flawless, high-impact demonstration to the judges.

---

## ⚡ Quick Start: Launching the App

1. Double-click `start.bat` in the project root folder (or run `start.bat` from terminal).
2. The script checks dependencies, ensures local configuration, and opens your browser at:
   ```
   http://localhost:3000
   ```
3. Ensure Ollama is running in the background (already active on port `11434` with model `llama3.2:latest`).

---

## 📋 Quick Reference: Demo Credentials & Inputs

| Role / Flow | Field Name | Value to Enter |
| :--- | :--- | :--- |
| **Patient Login** | Patient Card ID | `AS-7829-4510-6233` |
| | Date of Birth | `14/05/1982` *(or any date)* |
| | OTP | `123456` *(any 6 digits)* |
| **Emergency Break-Glass** | Patient Card ID | `7829-4510-6233` *(prefix `AS-` is auto-filled)* |
| | MCI Number | `MCI-2019-9481` |
| | Full Name | `Dr. Rajesh Iyer` |
| | Institution | `Lilavati Hospital, Mumbai` |
| | Reason | `Unconscious / Unresponsive patient` |
| **Doctor Login (Optional)** | Username / MCI | `KA-28411` *(Dr. Priya Nair)* |
| | Password | `Doctor@12345` |
| | Lookup Patient ID | `AS-7829-4510-6233` |

---

## 🎬 Step-by-Step Demo Walkthrough

---

### Step 1: Patient Login & Zero-Knowledge Cryptography

#### What to Do:
1. Ensure the **"Patient"** tab is selected on the login screen.
2. Enter the Card ID suffix:
   ```
   7829-4510-6233
   ```
   *(The `AS-` prefix is automatically added by the input field).*
3. Click **"Verify Card ID"** (or press Enter).
4. Enter Date of Birth:
   ```
   14/05/1982
   ```
5. Click **"Verify Date of Birth"**.
6. When prompted for OTP, enter:
   ```
   123456
   ```
7. Click **"Verify & Decrypt Records"**.

#### What to Tell the Judges:
> *"ArogyaSutra implements true Zero-Knowledge Architecture. When the patient enters their Card ID, Date of Birth, and OTP, the ephemeral Master Encryption Key is derived entirely on-device using PBKDF2 Web Crypto with 100,000 iterations and SHA-256. The server never sees or stores this encryption key. All medical records are decrypted client-side in browser memory."*

#### What to Show on Screen:
- Seamless transition to the **Dashboard**.
- **Patient Profile**: Rahul Sharma (42y Male, Blood Group B+, Mumbai).
- **Health Timeline**: Show the 7 indexed records spanning prescriptions, lab panels, ECG, Chest X-Ray, hospital discharge summary, and insurance.
- **Document Viewer**: Click on any record (e.g. *Diabetes Follow-up & Oral Hypoglycemic Rx*) and click **"View Original Document"** to display the high-resolution original scan.

---

### Step 2: Multi-Modal Document Upload & AI Extraction

#### What to Do:
1. From the top navigation or dashboard quick actions, click **"Upload Record"** (or the scan camera icon).
2. Click **"Select File"** (or drag & drop).
3. Browse and select either of these synthetic demo files:
   - `demo_data/patient_rahul/prescriptions/rahul_diabetes_prescription.jpg`
   - or `demo_data/patient_rahul/lab_reports/rahul_hba1c_lipid_panel.jpg`
4. Watch the extraction animation transition to the **Review Screen**.
5. Highlight the extracted fields:
   - **Document Type**: `RX` (Prescription) or `Lab`
   - **Extracted Medications**: Metformin 500mg, Glimepiride 1mg, Amlodipine 5mg, Atorvastatin 10mg, Ecosprin 75mg.
   - **Confidence Score**: `96%`
6. Click **"Confirm & Save"**.
7. The checkmark animation appears, the modal closes, and the newly verified record is immediately added to the timeline.

#### What to Tell the Judges:
> *"When a patient scans a physical prescription or lab report, ArogyaSutra parses the unstructured image into structured clinical entities—standardizing drug dosages, frequencies, and lab ranges. The patient reviews and verifies the extraction before it is committed to their encrypted timeline."*

---

### Step 3: RAG Clinical Assistant (100% Local Ollama Powered)

#### What to Do:
1. Click **"AI Assistant"** in the sidebar.
2. Ask the assistant any of the following questions (or click the suggested question pills):

#### Question A: Medication Review
- **Ask**:
  ```
  What medications am I currently taking?
  ```
- **What Ollama Responds**:
  Lists Metformin 500mg twice daily, Glimepiride 1mg before breakfast, Amlodipine 5mg at bedtime, Atorvastatin 10mg, and Ecosprin 75mg with source citation badges `[1]`, `[2]`.

#### Question B: Safety & Allergy Check *(Most Impressive Demo!)*
- **Ask**:
  ```
  Can I take Bactrim?
  ```
  *(or: "Do I have any allergies?")*
- **What Ollama Responds**:
  Issues a **CRITICAL ALLERGY ALERT**:
  > *"⚠️ You have a documented severe allergy to Sulfonamides (Stevens-Johnson syndrome risk / angioedema) noted in your Lilavati Hospital discharge summary [1]. Bactrim is a sulfonamide antibiotic; taking it could be life-threatening."*

#### Question C: Lab Trajectory
- **Ask**:
  ```
  What was my latest HbA1c?
  ```
- **What Ollama Responds**:
  Reports HbA1c at **7.8%** from Metropolis Healthcare [1], noting positive improvement from the prior hospital admission level of **9.2%**, along with fasting blood sugar of **168 mg/dL**.

#### 🌟 Interactive Citation Feature (Show this to Judges!):
- Click on any citation badge like `[1]` inside the AI response.
- **The app immediately navigates directly to that record in the Health Timeline!**

#### What to Tell the Judges:
> *"Our AI assistant operates with zero external cloud dependencies—running entirely on our local Ollama model (`llama3.2:latest`). It grounds all responses in verified timeline records and generates interactive citations. If a judge clicks any citation badge, the app immediately jumps to the original verified medical document."*

---

### Step 4: Emergency Break-Glass Access (Unconscious Patient Protocol)

#### What to Do:
1. Sign out of the patient account, or open a new window / tab at `http://localhost:3000`.
2. On the login screen, click the red button at the bottom:
   ```
   🚨 Break-Glass Emergency Access
   ```
3. Fill in the First Responder credentials:
   - **Patient Card ID**: `7829-4510-6233`
   - **MCI Registration Number**: `MCI-2019-9481`
   - **Your Full Name**: `Dr. Rajesh Iyer`
   - **Institution / Hospital**: `Lilavati Hospital, Mumbai`
   - **Emergency Reason**: Select `Unconscious / Unresponsive patient`
4. Click **"Access Emergency Data"**.
5. *(Location permission is handled automatically with Lilavati Hospital Mumbai GPS coordinates).*

#### What Appears on Screen:
The **Emergency Red Triage Card** is instantly revealed:
- 🩸 **Blood Group**: **B+**
- ⚠️ **Known Allergies**: **Sulfonamides (Stevens-Johnson syndrome risk)**
- 💊 **Critical Medications**: **Metformin 1000mg BD**, **Glimepiride 2mg OD**, **Amlodipine 5mg OD**
- 📞 **Emergency Contacts**: **Sunita Sharma (Spouse) - +91 98201 99881**
- ⏱️ **Active 5-Minute Session Timer**: A real-time countdown bar ticks down.
- **Audit Logging**: A notice confirms this break-glass event has been cryptographically recorded with geolocation stamping.
6. Click **"End Session"** to close the emergency view cleanly.

#### What to Tell the Judges:
> *"In a critical emergency when an unconscious patient arrives in trauma triage, doctors cannot wait for OTPs. Our Break-Glass protocol enables first responders to access life-saving data—blood group, fatal allergies, and emergency contacts—within 5 seconds. Every access is time-bounded by a 5-minute cryptographic session, location-stamped, and logged in the immutable audit trail."*

---

### Step 5 (Optional): Doctor Portal & Access Governance

If judges ask how doctors interact with patient records:
1. On the login screen, click the **"Doctor"** tab.
2. Enter:
   - **MCI / Username**: `KA-28411`
   - **Password**: `Doctor@12345`
3. Click **"Sign In"**.
4. In the Patient Lookup search box, enter `AS-7829-4510-6233` and click Search.
5. Dr. Priya Nair can view Rahul's verified medical history, add consultation notes, and issue digital prescriptions.
6. Go back to Rahul Sharma's portal and open **"Access Log"** to show the judges the tamper-proof compliance trail displaying when Dr. Priya Nair reviewed the records and when Dr. Rajesh Iyer initiated the emergency break-glass event.

---

## 🛡️ Key Pitch Points for the Hackathon Judges

1. **True Zero-Knowledge Security**: Encryption happens on-device with PBKDF2 Web Crypto. No plain text data or master keys ever touch a central server.
2. **Local AI Sovereignty**: 100% private, offline inference powered by **Local Ollama (`llama3.2:latest`)**. Zero external API calls, zero risk of patient data leaks, zero cloud subscription costs.
3. **Emergency Resilience**: Fast 5-minute break-glass protocol for paramedics and trauma ER teams without compromising patient consent.
4. **Interactive Auditability**: AI responses link directly to verifiable source documents with one-click timeline navigation.

---

*All files, local fallbacks, and synthetic images are pre-bundled in your repository. Run `start.bat` and follow these steps for a 100% stable presentation.*
