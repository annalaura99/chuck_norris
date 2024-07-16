import { Controller, Get, Query, Param } from '@nestjs/common';
import { JokesService } from './jokes.service';

@Controller('jokes')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Get('random')
  async getRandom() {
    try {
      return await this.jokesService.getRandomJoke();
    } catch (error) {
      console.error('Error fetching random joke:', error); 
      throw new Error('Internal Server Error');
    }
  }

  @Get('search')
  async searchJoke(@Query('q') query: string) {
    try {
      return await this.jokesService.searchJoke(query);
    } catch (error) {
      console.error('Error searching jokes:', error); 
      throw new Error('Internal Server Error');
    }
  }

  @Get('logs')
  async getLogs(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    try {
      return await this.jokesService.getLogs(startDate, endDate);
    } catch (error) {
      console.error('Error reading logs:', error); 
      throw new Error('Internal Server Error');
    }
  }
}
