import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { logQuery, readLogs } from 'utils/logger';

const API_URL = 'https://api.chucknorris.io/jokes';

@Injectable()
export class JokesService {
  async getRandomJoke() {
    const response = await axios.get(`${API_URL}/random`);
    const joke = response.data;
    console.log('Random Joke:', joke.value); 
    await logQuery('random', '', joke.value);
    return joke;
  }

  async searchJoke(query: string) {
    const response = await axios.get(`${API_URL}/search`, { params: { query } });
    const jokes = response.data.result;
    let result = 'No jokes found';
    if (jokes.length > 0) {
      result = jokes.map((joke: any) => joke.value).join('\n'); 
      await logQuery('search', query, result);
    }
    console.log('Search Joke Result:', result);
    return jokes;
  }

  async getLogs(startDate: string, endDate: string) {
    console.log('Query Params - startDate:', startDate, 'endDate:', endDate);
    const logs = await readLogs(startDate, endDate);
    console.log('Logs:', logs);
    return logs;
  }
}
