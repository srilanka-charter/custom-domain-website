import { describe, it, expect } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP-konfiguration", () => {
  it("bör ha GMAIL_USER inställt", () => {
    const user = process.env.GMAIL_USER;
    expect(user).toBeTruthy();
    expect(user).toContain("@");
  });

  it("bör ha GMAIL_APP_PASSWORD inställt", () => {
    const pass = process.env.GMAIL_APP_PASSWORD;
    expect(pass).toBeTruthy();
    expect(pass!.length).toBeGreaterThan(0);
  });

  it("bör skapa en nodemailer-transporter utan fel", () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER ?? "test@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD ?? "testpass",
      },
    });
    expect(transporter).toBeDefined();
  });
});
