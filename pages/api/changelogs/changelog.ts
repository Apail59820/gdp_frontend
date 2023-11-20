import fs from 'fs';
import type {NextApiRequest, NextApiResponse} from 'next'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET'){
        return res.status(500).send('Request method must be a GET.');
    }

    try {
        const filePath = `./changelog.json`;
        if (!fs.existsSync(filePath)) {
            return res.status(404).send(`Couldn't locate changelog file.`);
        }

        // Set the appropriate content type for a JSON File
        res.setHeader('Content-Type', 'application/json');

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch data' })
    }
}