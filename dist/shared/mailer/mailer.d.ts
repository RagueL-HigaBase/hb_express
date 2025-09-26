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
    from?: string;
};
export declare class Mailer {
    private readonly user;
    private readonly password;
    private readonly host;
    private readonly port;
    private readonly secure;
    private transporter?;
    private validateCredentials;
    private getTransport;
    send(input: MailInput): Promise<void>;
}
export {};
//# sourceMappingURL=mailer.d.ts.map