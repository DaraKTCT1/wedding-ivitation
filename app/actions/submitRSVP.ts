"use server";

import { Resend } from "resend";
import { createClient } from "../utils/supabase/server";
import { strings } from "../utils/strings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitRSVP(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name");
  const email = formData.get("email");
  const accompany = formData.get("accompany");
  const attendance = formData.get("attendance");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase.from("rsvps").insert([
    {
      name,
      email,
      accompany,
      attendance,
    },
  ]);

  if (error) {
    console.error("Error inserting RSVP : ", error);
    return {
      success: false,
      message: "False to insert RSVP",
      error,
    };
  }

  try {
    await resend.emails.send({
      from: "DARA-RSVP <onboarding@resend.dev>",
      to: strings.sendToEmail!,
      subject: "New RSVP Submission",
      html: `
        <h3>New RSVP Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Number of Guests:</strong> ${accompany}</p>
        <p><strong>Attendance:</strong> ${attendance}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending email : ", error);
  }

  return {
    success: true,
    message: "Insert RSVP successfully",
  };
}
