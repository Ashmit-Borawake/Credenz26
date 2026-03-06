import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//pisbcredenz26
const transporter1 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // 587 = false
  auth: {
    user: process.env.SMTP_USER1,
    pass: process.env.SMTP_PASS1,
  },
});

//ondesk1credenz
const transporter2 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // 587 = false
  auth: {
    user: process.env.SMTP_USER2,
    pass: process.env.SMTP_PASS2,
  },
});

//ondeskcredenz
const transporter3 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // 587 = false
  auth: {
    user: process.env.SMTP_USER3,
    pass: process.env.SMTP_PASS3,
  },
});
//credenz26.update
const transporter4 = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // 587 = false
  auth: {
    user: process.env.SMTP_USER4,
    pass: process.env.SMTP_PASS4,
  },
});


const loadTemplate = (templateName: string, replacements: Record<string, string>) => {
    const templatePath = path.join(__dirname, 'templates', templateName);
    let html = fs.readFileSync(templatePath, 'utf-8');
    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, replacements[key] as string);
    }
    return html;
};
//3
export const sendForgotPasswordEmail = async (to: string, username: string, otp: string, expiry: string) => {
    try {
        const html = loadTemplate('forgot.html', { username, otp, expiry,logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
            websiteurl: process.env.WEBSITE_URL!
         });
        await transporter3.sendMail({
            from: process.env.SMTP_USER3,
            to,
            subject: 'Password Reset | Credenz 2026',
            html,
        });
        console.log(`Forgot password email sent to ${to}`);
    } catch (error) {
        console.error('Error sending forgot password email:', error);
    }
};

//1
export const sendSignUpEmail = async (to: string, subject: string, content: string, username: string) => {
    try {
        const html = loadTemplate('contact.html', { subject, websiteurl: process.env.WEBSITE_URL!, username: username,logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
        });
        const res = await transporter1.sendMail({
            from: process.env.SMTP_USER1,
            to,
            subject,
            html,
        });
        console.log(res)
        console.log(`Signup email sent to ${to}`);
    } catch (error) {
        console.error('Error sending generic email:', error);
    }
};


export type OrderedEvent = {
    name: string;
    price?: number;
    date?: string;
    username1:string,
    username2?:string,
    username3?:string,
    username4?:string
};

//4
export const sendOrderEmail = async (
    to: string,
    username: string,
    ordered_events: OrderedEvent[]
) => {
    try {
        const eventListHTML = `
          <ul>
            ${ordered_events
                .map((event) => {
                    const teammates = [
                        event.username1,
                        event.username2,
                        event.username3,
                        event.username4,
                    ].filter(Boolean); // removes undefined

                    const teammatesHTML = `
                      <ul style="margin-top:6px;">
                        ${teammates
                            .map(
                                (member, index) =>
                                    `<li>${index === 0 ? "Leader" : "Member"}: ${member}</li>`
                            )
                            .join("")}
                      </ul>
                    `;

                    return `
                      <li>
                        <strong>${event.name}</strong>
                        ${event.date ? ` - ${event.date}` : ""}
                        ${event.price ? ` (₹${event.price})` : ""}
                        ${teammatesHTML}
                      </li>
                    `;
                })
                .join("")}
          </ul>
        `;

        const html = loadTemplate("order.html", {
            subject: "Your Credenz'26 Event Registration",
            username,
            websiteurl: process.env.WEBSITE_URL!,
            eventList: eventListHTML,
            logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
        });

        await transporter4.sendMail({
            from: process.env.SMTP_USER4,
            to,
            subject: "Your Credenz'26 Event Registration",
            html,
        });

        console.log(`Order email sent to ${to}`);
    } catch (error) {
        console.error("Error sending order email:", error);
    }
};

// 2
export const sendOrderEmailAdmin = async (
    to: string,
    username: string,
    ordered_events: OrderedEvent[]
) => {
    try {
        const eventListHTML = `
          <ul>
            ${ordered_events
                .map((event) => {
                    const teammates = [
                        event.username1,
                        event.username2,
                        event.username3,
                        event.username4,
                    ].filter(Boolean); // removes undefined

                    const teammatesHTML = `
                      <ul style="margin-top:6px;">
                        ${teammates
                            .map(
                                (member, index) =>
                                    `<li>${index === 0 ? "Leader" : "Member"}: ${member}</li>`
                            )
                            .join("")}
                      </ul>
                    `;

                    return `
                      <li>
                        <strong>${event.name}</strong>
                        ${event.date ? ` - ${event.date}` : ""}
                        ${event.price ? ` (₹${event.price})` : ""}
                        ${teammatesHTML}
                      </li>
                    `;
                })
                .join("")}
          </ul>
        `;

        const html = loadTemplate("order.html", {
            subject: "Your Credenz'26 Event Registration",
            username,
            websiteurl: process.env.WEBSITE_URL!,
            eventList: eventListHTML,
            logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
        });

        await transporter2.sendMail({
            from: process.env.SMTP_USER2,
            to,
            subject: "Your Credenz'26 Event Registration",
            html,
        });

        console.log(`Order email sent to ${to}`);
    } catch (error) {
        console.error("Error sending order email:", error);
    }
};

export const sendPassApprovalEmail = async (
    to: string,
    username: string
) => {
    try {
        
        const html = loadTemplate("pass-approval.html", {
            username,
            websiteurl: process.env.WEBSITE_URL!,
            logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
        });

        await transporter2.sendMail({
            from: process.env.SMTP_USER2,
            to,
            subject: "Your Credenz 26 Pass is Approved 🎉",
            html,
        });

        console.log(`Pass approval email sent to ${to}`);
    } catch (error) {
        console.error("Error sending pass approval email:", error);
    }
};

export const sendGenericEmail = async (to: string, subject: string, content: string, username: string) => {
    try {
        const html = loadTemplate('generic.html', { subject, username: username,logourl: process.env.LOGO_URL!,
            aboutusurl: process.env.ABOUTUS_URL!,
            websiteurl: process.env.WEBSITE_URL!,content:content});
        await transporter2.sendMail({
            from: process.env.SMTP_USER2,
            to,
            subject,
            html,
        });
        console.log(`Generic email sent to ${to}`);
    } catch (error) {
        console.error('Error sending generic email:', error);
    }
};
