import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import nodemailer from "nodemailer";

// ─── Email helper ─────────────────────────────────────────────────────────────
async function sendEnquiryEmail(data: {
  name: string;
  country: string;
  countryOther?: string;
  email: string;
  phone?: string;
  startDate: string;
  endDate: string;
  pickup: string;
  adults: string;
  children: string;
  vehicle: string;
  currency?: string;
  notes?: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER ?? "srilanka.41032@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD ?? "",
    },
  });

  const countryDisplay = data.country === "Other" && data.countryOther
    ? `Övrigt — ${data.countryOther}`
    : data.country;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 8px;">
      <div style="background: #1a1a1a; color: #c9a84c; padding: 16px 24px; border-radius: 6px 6px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 1.4rem; letter-spacing: 0.05em;">SLTCS — Ny förfrågan mottagen</h1>
        <p style="margin: 4px 0 0; color: #aaa; font-size: 0.85rem;">Hyr bil med privat förare på Sri Lanka</p>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 0 0 6px 6px; border: 1px solid #e0e0e0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; width: 40%; border-bottom: 1px solid #eee;">Fullständigt namn</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Land</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${countryDisplay}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">E-post</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Telefon</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.phone || "—"}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Startdatum</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.startDate}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Slutdatum</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.endDate}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Upphämtningsplats</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.pickup}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Vuxna</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.adults}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Barn</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.children}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Fordonstyp</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.vehicle}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; border-bottom: 1px solid #eee;">Föredragen valuta</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${data.currency || "—"}</td></tr>
          <tr><td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Anteckningar / Resplan</td><td style="padding: 8px 12px;">${data.notes || "—"}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 12px 16px; background: #fff8e6; border-left: 4px solid #c9a84c; border-radius: 4px;">
          <strong>Åtgärd krävs:</strong> Vänligen svara kunden på <a href="mailto:${data.email}">${data.email}</a> inom 24 timmar.
        </div>
      </div>
      <p style="text-align: center; color: #aaa; font-size: 0.78rem; margin-top: 16px;">SLTCS｜Hyr bil med privat förare på Sri Lanka</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"SLTCS Förfrågningssystem" <${process.env.GMAIL_USER ?? "srilanka.41032@gmail.com"}>`,
    to: "srilanka.41032@gmail.com",
    subject: `[SLTCS] Ny förfrågan från ${data.name} (${countryDisplay})`,
    html,
  });
}

// ─── Enquiry input schema ─────────────────────────────────────────────────────
const enquirySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  countryOther: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  pickup: z.string().min(1),
  adults: z.string().min(1),
  children: z.string(),
  vehicle: z.string().min(1),
  currency: z.string().optional(),
  notes: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) =>
{
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Enquiry submission ───────────────────────────────────────────────────
  enquiry: router({
    submit: publicProcedure
      .input(enquirySchema)
      .mutation(async ({ input }) => {
        const countryDisplay = input.country === "Other" && input.countryOther
          ? `Övrigt — ${input.countryOther}`
          : input.country;

        // 1. Send email via Gmail SMTP
        try {
          await sendEnquiryEmail(input);
          console.log("[Enquiry] E-post skickades till srilanka.41032@gmail.com");
        } catch (err) {
          console.error("[Enquiry] Det gick inte att skicka e-post:", err);
          // Blockera inte svaret — meddela ändå ägaren via Manus
        }

        // 2. Notify owner via Manus notification system (fallback)
        const notifContent = [
          `Namn: ${input.name}`,
          `Land: ${countryDisplay}`,
          `E-post: ${input.email}`,
          `Telefon: ${input.phone || "—"}`,
          `Startdatum: ${input.startDate}`,
          `Slutdatum: ${input.endDate}`,
          `Upphämtning: ${input.pickup}`,
          `Vuxna: ${input.adults} / Barn: ${input.children}`,
          `Fordon: ${input.vehicle}`,
          `Valuta: ${input.currency || "—"}`,
          `Anteckningar: ${input.notes || "—"}`,
        ].join("\n");

        await notifyOwner({
          title: `Ny förfrågan från ${input.name} (${countryDisplay})`,
          content: notifContent,
        }).catch(e => console.warn("[Enquiry] Manus-notifiering misslyckades:", e));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
