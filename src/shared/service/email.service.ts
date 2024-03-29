import nodemailer, { type SendMailOptions } from 'nodemailer';
import { compile } from 'handlebars';
import { Injectable } from '@nestjs/common';
// import { TemplateModel } from 'database/models/TemplateModel';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { NotificationLogModel } from 'database/models/NotificationLogModel';

export type MySendMailOptions = SendMailOptions & {
  context: any;
};

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    // @InjectRepository(TemplateModel)
    // private templateRepo: Repository<TemplateModel>,
    // @InjectRepository(NotificationLogModel)
    // private notificationLogRepo: Repository<NotificationLogModel>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      secure: false, // true for 465, false for other ports
      tls: {
        rejectUnauthorized: false, // do not fail on invalid certs
      },
    });
  }

  // private async compileTemplate(
  //   templateId: string,
  //   data: Record<string, any>,
  // ): Promise<string> {
  //   const templateInfo = await this.getEmailTemplateById(templateId);
  //   if (!templateInfo) {
  //     throw new Error('Template not found');
  //   }
  //   const templateMaker = compile(templateInfo.template);
  //   return templateMaker(data);
  // }

  // public async sendEmail(
  //   mailOptions: MySendMailOptions,
  // ): Promise<nodemailer.SentMessageInfo> {
  //   try {
  //     await this.logNotification(null, mailOptions.context, 'email');
  //     await this.transporter.sendMail(mailOptions);
  //   } catch (err) {
  //     console.error(err);
  //     await this.logNotification(null, mailOptions.context, 'email', 'failed');
  //   }
  // }

  // public async sendEmailWithTemplate(
  //   templateId: string,
  //   templateData: Record<string, any>,
  //   mailOptions: Omit<MySendMailOptions, 'html'>,
  // ): Promise<nodemailer.SentMessageInfo> {
  //   try {
  //     console.log('LOGIC GETS HERE ALSO', { templateData, templateId });
  //     const html = await this.compileTemplate(templateId, templateData);
  //     await this.logNotification(templateId, mailOptions.context, 'email');
  //     await this.sendEmail({ ...mailOptions, html });
  //   } catch (err) {
  //     await this.logNotification(
  //       templateId,
  //       mailOptions.context,
  //       'email',
  //       'failed',
  //     );
  //   }
  // }

  // private async getEmailTemplateById(
  //   id: string,
  // ): Promise<TemplateModel | undefined> {
  //   const template = await this.templateRepo.findOne({
  //     where: { template_id: id, type: 'email' },
  //   });

  //   return template || undefined;
  // }

  // private async getSmsTemplateById(
  //   id: string,
  // ): Promise<TemplateModel | undefined> {
  //   const template = await this.templateRepo.findOne({
  //     where: { template_id: id, type: 'sms' },
  //   });

  //   return template || undefined;
  // }

  // private async logNotification(
  //   templateId: string | null,
  //   data: any,
  //   service: string,
  //   status = 'sent',
  // ) {
  //   try {
  //     console.log('I GET HERE ALSO', { templateId, data, service, status });
  //     const notificationLog = new NotificationLogModel();
  //     notificationLog.template_id = templateId;
  //     notificationLog.data = JSON.stringify(data);
  //     notificationLog.service = service;
  //     notificationLog.status = status;
  //     notificationLog.date_sent = new Date();

  //     await this.notificationLogRepo.save(notificationLog);
  //   } catch (err) {
  //     console.error('error occured while saving notification ===>>>', err);
  //   }
  // }
}
