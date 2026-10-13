// ============================================================
// GET /api/timeline/entries?patientId=AS-XXXX
// Fetches health timeline entries from DynamoDB
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { putAuditLog } from "../../../../lib/aws/dynamodb";

const region = process.env.NEXT_PUBLIC_AWS_REGION || process.env.APP_AWS_REGION || "ap-south-1";

const creds =
    process.env.APP_AWS_ACCESS_KEY_ID && process.env.APP_AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
            },
        }
        : {};

const client = new DynamoDBClient({ region, ...creds });
const db = DynamoDBDocumentClient.from(client);

const TABLE = process.env.DYNAMODB_HEALTH_RECORDS_TABLE || "arogyasutra-health-records";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    // Optional actor context passed by the client (doctor viewing patient records)
    const viewerType = searchParams.get("viewerType") as "PATIENT" | "DOCTOR" | null;
    const viewerId = searchParams.get("viewerId");
    const viewerName = searchParams.get("viewerName");

    if (!patientId) {
        return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    try {
        const result = await db.send(
            new QueryCommand({
                TableName: TABLE,
                KeyConditionExpression: "patientId = :pid",
                ExpressionAttributeValues: { ":pid": patientId },
                ScanIndexForward: false, // newest first
                Limit: 50,
            })
        );

        const entries = (result.Items ?? []).map((item) => ({
            entryId: item.entryId,
            patientId: item.patientId,
            title: item.title,
            documentType: item.documentType,
            statusFlags: item.statusFlags ?? [],
            sourceInstitution: item.sourceInstitution,
            doctorName: item.doctorName,
            date: item.date,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            encryptedBlobKey: item.encryptedBlobKey ?? "",
            fhirResourceIds: item.fhirResourceIds ?? [],
            confidenceScore: item.confidenceScore,
            addedBy: item.addedBy,
            metadata: item.metadata ?? {},
        }));

        // Write audit log non-blocking (failure must not block the response)
        const actorType = viewerType === "DOCTOR" ? "DOCTOR" : "PATIENT";
        const actorId = viewerId ?? patientId;
        const actorName = viewerName ?? (actorType === "PATIENT" ? "Patient" : "Doctor");
        const auditAction = actorType === "DOCTOR" ? "DOCTOR_VIEW_TIMELINE" : "TIMELINE_VIEW";
        putAuditLog({
            logId: randomUUID(),
            patientId,
            action: auditAction,
            performedBy: { type: actorType, userId: actorId, name: actorName },
            timestamp: new Date().toISOString(),
            userAgent: req.headers.get("user-agent") ?? undefined,
            details: { entryCount: String(entries.length) },
        }).catch((e) => console.error("[audit] TIMELINE_VIEW write failed:", e));

        return NextResponse.json({
            entries,
            totalCount: entries.length,
            hasMore: false,
        });
    } catch (err) {
        const msg = (err as Error).message ?? "Unknown error";
        console.warn("[/api/timeline/entries] DynamoDB query failed, using demo fallback:", msg);

        // Fallback demo records aligned with demo_data suite
        const demoEntries = [
            {
                entryId: "demo-entry-1",
                patientId,
                title: "Diabetes Follow-up & Oral Hypoglycemic Rx",
                documentType: "RX",
                statusFlags: ["active"],
                sourceInstitution: "Mehta Clinic, Bandra West",
                doctorName: "Dr. Vikram Mehta",
                date: "2026-09-08",
                createdAt: "2026-09-08T10:30:00Z",
                updatedAt: "2026-09-08T10:30:00Z",
                confidenceScore: 0.96,
                addedBy: "patient",
                encryptedBlobKey: "/demo_data/patient_rahul/prescriptions/rahul_diabetes_prescription.jpg",
                metadata: {
                    medications: [
                        { name: "Metformin", dosage: "500mg", frequency: "1-0-1 (BD)", route: "oral" },
                        { name: "Glimepiride", dosage: "1mg", frequency: "1-0-0 (OD)", route: "oral" },
                        { name: "Amlodipine", dosage: "5mg", frequency: "0-0-1 (OD)", route: "oral" },
                        { name: "Atorvastatin", dosage: "10mg", frequency: "0-0-1 (HS)", route: "oral" },
                    ],
                    diagnoses: ["Type 2 Diabetes Mellitus", "Hypertension Stage I", "Dyslipidemia"],
                },
            },
            {
                entryId: "demo-entry-2",
                patientId,
                title: "Glycated Hemoglobin (HbA1c) & Fasting Lipid Panel",
                documentType: "Lab",
                statusFlags: ["abnormal"],
                sourceInstitution: "Metropolis Healthcare Ltd.",
                doctorName: "Dr. Sanjay Kulkarni",
                date: "2026-09-06",
                createdAt: "2026-09-06T09:00:00Z",
                updatedAt: "2026-09-06T09:00:00Z",
                confidenceScore: 0.98,
                addedBy: "patient",
                encryptedBlobKey: "/demo_data/patient_rahul/lab_reports/rahul_hba1c_lipid_panel.jpg",
                metadata: {
                    diagnoses: ["Suboptimal Glycemic Control", "Mixed Dyslipidemia"],
                    labTests: [
                        { name: "HbA1c", value: "7.8", unit: "%", flag: "HIGH", range: "4.0 - 5.6" },
                        { name: "Fasting Blood Sugar", value: "168", unit: "mg/dL", flag: "HIGH", range: "70 - 100" },
                        { name: "Total Cholesterol", value: "242", unit: "mg/dL", flag: "HIGH", range: "< 200" },
                        { name: "Triglycerides", value: "198", unit: "mg/dL", flag: "HIGH", range: "< 150" },
                        { name: "Serum Creatinine", value: "1.1", unit: "mg/dL", flag: "NORMAL", range: "0.7 - 1.3" },
                    ],
                },
            },
            {
                entryId: "demo-entry-3",
                patientId,
                title: "Cardiology Consultation & Echo Evaluation",
                documentType: "Consult",
                statusFlags: ["active"],
                sourceInstitution: "Apollo Hospitals, Navi Mumbai",
                doctorName: "Dr. Priya Nair",
                date: "2026-07-25",
                createdAt: "2026-07-25T11:45:00Z",
                updatedAt: "2026-07-25T11:45:00Z",
                confidenceScore: 0.95,
                addedBy: "doctor",
                encryptedBlobKey: "/demo_data/patient_rahul/prescriptions/rahul_cardiology_prescription.jpg",
                metadata: {
                    medications: [
                        { name: "Telmisartan", dosage: "40mg", frequency: "0-0-1 (OD)", route: "oral" },
                        { name: "Metoprolol ER", dosage: "25mg", frequency: "1-0-0 (OD)", route: "oral" },
                    ],
                    diagnoses: ["Concentric LVH", "Stage I Diastolic Dysfunction"],
                },
            },
            {
                entryId: "demo-entry-4",
                patientId,
                title: "12-Lead Resting Electrocardiogram (ECG)",
                documentType: "Imaging",
                statusFlags: ["reviewed"],
                sourceInstitution: "Apollo Hospitals, Navi Mumbai",
                doctorName: "Dr. Priya Nair",
                date: "2026-07-25",
                createdAt: "2026-07-25T11:50:00Z",
                updatedAt: "2026-07-25T11:50:00Z",
                confidenceScore: 0.94,
                addedBy: "doctor",
                encryptedBlobKey: "/demo_data/patient_rahul/imaging/Apollo Hospitals ECG Report.png",
                metadata: {
                    diagnoses: ["Left Ventricular Hypertrophy with Strain Pattern (V5-V6)", "Left Axis Deviation"],
                },
            },
            {
                entryId: "demo-entry-5",
                patientId,
                title: "Chest X-Ray (PA View)",
                documentType: "Imaging",
                statusFlags: ["reviewed"],
                sourceInstitution: "Apollo Hospitals, Navi Mumbai",
                doctorName: "Dr. Anil Deshmukh",
                date: "2026-07-25",
                createdAt: "2026-07-25T12:00:00Z",
                updatedAt: "2026-07-25T12:00:00Z",
                confidenceScore: 0.92,
                addedBy: "doctor",
                encryptedBlobKey: "/demo_data/patient_rahul/imaging/Chest X-Ray and Radiology Report.png",
                metadata: {
                    diagnoses: ["Borderline Cardiomegaly with LV Contour Prominence", "Lungs Clear Bilaterally"],
                },
            },
            {
                entryId: "demo-entry-6",
                patientId,
                title: "In-Patient Discharge Summary: Diabetic Ketoacidosis",
                documentType: "H",
                statusFlags: ["resolved"],
                sourceInstitution: "Lilavati Hospital & Research Centre",
                doctorName: "Dr. Ashok Patel",
                date: "2025-03-19",
                createdAt: "2025-03-19T14:00:00Z",
                updatedAt: "2025-03-19T14:00:00Z",
                confidenceScore: 0.97,
                addedBy: "hospital",
                encryptedBlobKey: "/demo_data/patient_rahul/discharge_summaries/Hospital Discharge Summary Pages.png",
                metadata: {
                    diagnoses: ["Diabetic Ketoacidosis (Moderate)", "Type 2 Diabetes Mellitus (HbA1c 9.2%)", "UTI (E. coli)"],
                    allergies: ["SULFONAMIDES (Rash + Angioedema)"],
                },
            },
            {
                entryId: "demo-entry-7",
                patientId,
                title: "Star Comprehensive Health Insurance Policy",
                documentType: "Insurance",
                statusFlags: ["active"],
                sourceInstitution: "Star Health and Allied Insurance",
                doctorName: "Medi Assist TPA",
                date: "2026-04-01",
                createdAt: "2026-04-01T08:00:00Z",
                updatedAt: "2026-04-01T08:00:00Z",
                confidenceScore: 0.99,
                addedBy: "patient",
                encryptedBlobKey: "/demo_data/patient_rahul/insurance/Star Health Insurance Policy Document.png",
                metadata: {
                    policyNumber: "SHI/MUM/26/IND/9987234",
                    sumInsured: "₹12,50,000",
                },
            },
        ];

        return NextResponse.json({
            entries: demoEntries,
            totalCount: demoEntries.length,
            hasMore: false,
        });
    }
}
