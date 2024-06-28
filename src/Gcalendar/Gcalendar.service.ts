import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { GoogleAccount, GoogleAccountDocument } from '../Gcalendar/Gcalendar.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dotenv from "dotenv";

@Injectable()
export class GcalendarService {
  oauth2Client: any;
  accessToken: string = "";

  constructor(
    @InjectModel(GoogleAccount.name) private googleAccountModel: Model<GoogleAccountDocument>,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('CLIENT_ID'),
      this.configService.get<string>('CLIENT_SECRET'),
      this.configService.get<string>('REDIRECT_URL'),
    );
  }


  async generateAuthentication(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    const url = await this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
    return url;
  }

  async saveAccountDetails(accountDetails: any) {
    try {

      const data = {
        email: accountDetails.email,
        access_token: accountDetails.access_token,
        refresh_token: accountDetails.refresh_token,
        scope: accountDetails.scope,
        expiry_date: accountDetails.expiry_date,
        token_type: accountDetails.token_type,
      }
      const saveData = await new this.googleAccountModel(data);
      saveData.save();
      console.log('Saved Data : ', saveData);
      return saveData;
    } catch (err) {
      console.log(err);
    }
  }

  async getAccessToken(code: string) {
    if (code) {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      const userInfoResponse = await this.oauth2Client.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      });

      const accountDetails = Object.assign(tokens, userInfoResponse.data);
      console.log('\n\n\n Account Details :', accountDetails, '\n\n\n\n');

      return this.saveAccountDetails(accountDetails);
    } else {
      console.log('Code Not Received');
    }
  }

  async getEvents() {

    this.oauth2Client.setCredentials({ access_token: this.accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log("\n\n\n Events : ", events.data.items);

    return events.data.items;

  }

  async storeAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }


  async checkEventAvailability(eventDetails: any) {

    this.oauth2Client.setCredentials({ access_token: this.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const eventStartTime = new Date(eventDetails.start.dateTime);
    const eventEndTime = new Date(eventDetails.end.dateTime);

    console.log("Start Time : ", eventStartTime);
    console.log("End Time : ", eventEndTime);

    const eventDate = new Date(eventDetails.start.dateTime).getDay();

    const startHour = eventStartTime.getHours();
    const endHour = eventEndTime.getHours();
    console.log({ startHour, endHour });

    if (eventDate === 0 || eventDate === 6) {
      const scheduleNotPossible = "The event can't be scheduled because it is on Weekend (Saturday/Sunday)";
      console.log(scheduleNotPossible);
      return scheduleNotPossible;
    }

    if (eventStartTime >= eventEndTime) {
      return "event start is higher than end time"
    }

    const minDate = new Date(eventStartTime.toString())
    minDate.setHours(9, 0, 0, 0);
    const maxDate = new Date(eventStartTime.toString())
    maxDate.setHours(17, 0, 0, 0);

    if (eventStartTime < minDate || eventEndTime > maxDate) {
      const notWorkingHoursMsg = "The event can't be scheduled outside the working hours  \n\n\n Working Hours is 09:00 - 23:00"
      console.log(notWorkingHoursMsg);
      return notWorkingHoursMsg;
    }

    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: eventStartTime.toISOString(),
      timeMax: eventEndTime.toISOString(),
    });

    if (events.data.items.length) {
      return false;
    }

    console.log('You can schedule the event at the proposed time.');
    return true;

  }


  async createEvent(eventDetails: any) {
    try {
      this.oauth2Client.setCredentials({ access_token: this.accessToken });

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const eventChecker = await this.checkEventAvailability(eventDetails);
      console.log("Event Checker : ", eventChecker);

      if (eventChecker === true) {
        const response = await calendar.events.insert({
          calendarId: 'primary',
          auth: this.oauth2Client,
          requestBody: eventDetails,
        });

        console.log("Event Successfully scheduled");
        return response.data; // Return the created event data
      } else if (eventChecker === false) {
        console.log('There are conflicting events at the proposed time.');
        return 'There are conflicting events at the proposed time.';
      } else {
        console.log(eventChecker);
        return eventChecker; // Return the error message
      }
    } catch (error) {
      console.error('Error creating event:', error);
      return 'An error occurred while creating the event.';
    }
  }


  async updateEventById(id: string, updatedEvent: any) {

    try {

      this.oauth2Client.setCredentials({ access_token: this.accessToken });

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.update({
        auth: this.oauth2Client,
        calendarId: 'primary',
        eventId: id,
        requestBody: updatedEvent,
      });

      console.log('Event updated successfully.');
      return response;

    } catch (err) {
      console.log(err);
    }
  }

  async deleteEventById(id: string) {

    try {

      this.oauth2Client.setCredentials({ access_token: this.accessToken });
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const deleteEvent = await calendar.events.delete({
        calendarId: 'primary',
        eventId: id,
      });

      console.log("Event Successfully Deleted");

      return "Event Successfully Deleted";

    } catch (err) {
      console.log(err);
    }

  }

}





