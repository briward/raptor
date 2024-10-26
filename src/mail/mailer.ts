import nodemailer from "npm:nodemailer@6.9.15";

export default class Mailer {
  private client;

  constructor() {
    this.client = nodemailer.createTransport({
      host: Deno.env.get('MAIL_HOST') as string,
      port: 2525,
      secure: false,
      auth: {
        user: Deno.env.get('MAIL_USERNAME') as string,
        pass: Deno.env.get('MAIL_PASSWORD') as string,
      },
    });
  }

  public async send(to: string, subject: string, content: string, html: string) {
    await this.client.sendMail({
      from: Deno.env.get('MAIL_FROM_ADDRESS') as string, 
      to,
      subject,
      content,
      html,
    });
    
    await this.client.close();
  }
};
