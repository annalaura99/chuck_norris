import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

const logsDir = path.resolve(__dirname, '../../logs');
const logsFilePath = path.resolve(logsDir, 'queries.csv');

// Cria a pasta logs se não existir
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

/**
 * Função para registrar uma consulta no arquivo CSV de logs
 * @param {string} type 
 * @param {string} query 
 * @param {string} result
 */
export const logQuery = async (type: string, query: string, result: string) => {
    const record = {
        timestamp: new Date().toISOString(),
        type,
        query,
        result
    };
    console.log('Log Record:', record); 

    const columns = [
        'timestamp',
        'type',
        'query',
        'result'
    ];

    stringify([record], { header: !fs.existsSync(logsFilePath), columns, quoted: true }, (err, data) => {
        if (err) {
            console.error('Error writing CSV:', err);
            return;
        }
        fs.appendFileSync(logsFilePath, data);
    });
};

/**
 * Função para ler e filtrar os logs do arquivo CSV
 * @param {string} startDate
 * @param {string} endDate 
 * @param {string} startTime 
 * @param {string} endTime  
 */
export const readLogs = (startDate?: string, endDate?: string, startTime?: string, endTime?: string): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
        const logs: any[] = [];
        const start = startDate ? new Date(`${startDate}T${startTime || '00:00:00'}`) : null;
        const end = endDate ? new Date(`${endDate}T${endTime || '23:59:59'}`) : null;
        console.log('Reading logs from:', start, 'to:', end); 

        fs.createReadStream(logsFilePath)
            .pipe(parse({ columns: true, trim: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }))
            .on('data', (row) => {
                const logDate = new Date(row.timestamp);
                console.log('Log Date:', logDate); 
                const isWithinRange =
                    (!start || logDate >= start) &&
                    (!end || logDate <= end);
                if (isWithinRange) {
                    logs.push(row);
                }
            })
            .on('end', () => {
                console.log('Logs Found:', logs); 
                resolve(logs);
            })
            .on('error', (error) => {
                console.error('Error reading logs:', error); 
                reject(error);
            });
    });
};
