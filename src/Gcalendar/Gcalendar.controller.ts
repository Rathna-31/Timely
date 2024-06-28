import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { GcalendarService } from '../Gcalendar/Gcalendar.service';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

@Controller('Gcalendar')
export class GcalendarController {
  constructor(private readonly gcalendarService: GcalendarService) { }

  @Get('google')
  async generateAuthentication(@Res() res: Response): Promise<any> {
    try {
      const authUrl = await this.gcalendarService.generateAuthentication();
      if (authUrl) {
        console.log('Successfully redirected');
        console.log({ authUrl });
        res.redirect(authUrl)
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Get('google/redirect')
  async getAccessToken(@Query('code') code: string, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const accountDetails = await this.gcalendarService.getAccessToken(code);
      res.json({ msg: "Thank you for the successful completion of authentication" })
    } catch (err) {
      res.json({ error: err })
      console.log(err);
    }
  }

  @Post('/save/access_token')
  async saveToken(@Body() tokenBody, @Req() req, @Res() res: Response): Promise<any> {
    const { token } = tokenBody;
    this.gcalendarService.storeAccessToken(token);
    console.log("Token saved");
    res.json({ msg: "saved" })
  }

  @Get('getCalendarEvent')
  async getEvents(): Promise<any> {
    try {

      return this.gcalendarService.getEvents();

    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Post('scheduleEvent')
  async createEvent(@Body() eventDetails: any): Promise<any> {
    try {
      return this.gcalendarService.createEvent(eventDetails);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Put('updateEvent/:id')
  async updateEventById(
    @Param('id') id: any,
    @Body() updatedEvent: any,
  ): Promise<any> {
    try {
      return this.gcalendarService.updateEventById(id, updatedEvent);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Delete('deleteEvent/:id')
  async deleteEventById(@Param('id') id: string): Promise<any> {

    try {

      return this.gcalendarService.deleteEventById(id);

    } catch (err) {
      console.log(err);
      return err;

    }


  }
}





















