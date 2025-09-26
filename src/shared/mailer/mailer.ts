import nodemailer, { type Transporter } from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

type MailInput = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
        filename?: string;
        content?: any;
        path?: string;
        contentType?: string;
    }>;
    from?: string; // по умолчанию возьмём MAILER_USER
};

export class Mailer {
    private readonly user = process.env.MAILER_USER ?? "";
    private readonly password = process.env.MAILER_PASSWORD ?? "";
    private readonly host = process.env.MAILER_HOST ?? "";
    private readonly port = Number(process.env.MAILER_PORT ?? 465);
    private readonly secure = this.port === 465; // 465=true, 587=false
    private transporter?: Transporter;

    private validateCredentials(): void {
        const missing: string[] = [];
        if (!this.user) missing.push("MAILER_USER");
        if (!this.password) missing.push("MAILER_PASSWORD");
        if (!this.host) missing.push("MAILER_HOST");
        if (missing.length) {
            const msg = `Mailer credentials missing: ${missing.join(", ")}`;
            throw new Error(msg);
        }
    }

    private async getTransport(): Promise<Transporter> {
        if (this.transporter) return this.transporter;

        this.validateCredentials();

        const transporter = nodemailer.createTransport({
            pool: true,
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: { user: this.user, pass: this.password },
            maxConnections: Number(process.env.MAILER_MAX_CONN ?? 5),
            maxMessages: Number(process.env.MAILER_MAX_MSG ?? 100),
            rateDelta: 1000, // окно 1 сек
            rateLimit: Number(process.env.MAILER_RATE_LIMIT ?? 10),
            connectionTimeout: 3_000,
            socketTimeout: 5_000,
            tls: { rejectUnauthorized: true },
        });

        // проверим соединение один раз
        try {
            await transporter.verify();
            // this.logger.info(`[Mailer] SMTP verified on ${this.host}:${this.port} (secure=${this.secure})`);
        } catch (err) {
            // this.logger.error(`[Mailer] verify failed: ${(err as Error).message}`);
            throw err;
        }

        this.transporter = transporter;
        return transporter;
    }
    public async send(input: MailInput): Promise<void> {
        const transporter = await this.getTransport();

        const mail = {
        from: input.from ?? this.user,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
        attachments: input.attachments,
        };

        // простой ретрай на одно повторение при сетевой ошибке
        try {
            const info = await transporter.sendMail(mail);
            // this.logger.info(`[Mailer] sent: ${info.messageId}`);
        } catch (err: any) {
            const msg = err?.message ?? String(err);
            const transient = /ECONN|ETIMEDOUT|EAI_AGAIN|ECONNRESET|ENOTFOUND/i.test(msg);
            // this.logger.warn(`[Mailer] send failed${transient ? " (transient)" : ""}: ${msg}`);
            if (transient) {
                // подождать 300–500 мс и повторить
                await new Promise(r => setTimeout(r, 400));
                const info2 = await transporter.sendMail(mail);
                // this.logger.info(`[Mailer] sent after retry: ${info2.messageId}`);
                return;
        }
        throw err;
        }
    }
}

