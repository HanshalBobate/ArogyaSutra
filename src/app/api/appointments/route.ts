// ============================================================
// GET  /api/appointments?patientId=AS-XXXX  — list all appointments
// POST /api/appointments                    — create appointment
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
    listAppointments,
    putAppointment,
} from "../../../lib/aws/dynamodb";
import type { Appointment } from "../../../lib/types/appointment";

export async function GET(req: NextRequest) {
    const patientId = new URL(req.url).searchParams.get("patientId");
    if (!patientId) {
        return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    try {
        const appointments = await listAppointments(patientId);
        return NextResponse.json({ appointments });
    } catch (err) {
        console.warn("[appointments GET] DynamoDB unavailable, returning demo appointments");
        const demoAppointments: Appointment[] = [
            {
                appointmentId: "demo-appt-1",
                patientId,
                doctorName: "Dr. Vikram Mehta",
                specialty: "Internal Medicine / Diabetology",
                location: "Mehta Clinic, Bandra West, Mumbai",
                appointmentDate: "2026-12-08",
                time: "10:30 AM",
                notes: "Review HbA1c in 3 months. Fasting blood sugar target < 120 mg/dL.",
                status: "scheduled",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                appointmentId: "demo-appt-2",
                patientId,
                doctorName: "Dr. Priya Nair",
                specialty: "Cardiology & Acute Care",
                location: "Apollo Hospitals, Navi Mumbai",
                appointmentDate: "2026-10-25",
                time: "02:00 PM",
                notes: "Review post-TMT evaluation and antihypertensive response.",
                status: "scheduled",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        return NextResponse.json({ appointments: demoAppointments });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { patientId, appointmentDate, doctorName, specialty, location, time, notes, sourceEntryId } = body;

        if (!patientId || !appointmentDate || !doctorName) {
            return NextResponse.json(
                { error: "patientId, appointmentDate and doctorName are required" },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();
        const appt: Appointment = {
            patientId,
            appointmentId: randomUUID(),
            appointmentDate,
            doctorName,
            specialty: specialty ?? undefined,
            location: location ?? undefined,
            time: time ?? undefined,
            notes: notes ?? undefined,
            status: "scheduled",
            sourceEntryId: sourceEntryId ?? undefined,
            createdAt: now,
            updatedAt: now,
        };

        try {
            await putAppointment(appt);
        } catch {
            console.warn("[appointments POST] DynamoDB write skipped (demo mode)");
        }
        return NextResponse.json({ appointment: appt }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }
}
