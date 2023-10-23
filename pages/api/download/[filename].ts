import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { filename } = req.query;

        const pdfPath = `./export_factures/${filename}`;

        // Check if the PDF file exists
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).send(`${pdfPath} PDF file not found`);
        }

        // Set the appropriate content type for a PDF file
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the PDF file to the response
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

    } catch (err) {
        res.status(500).send({ error: 'failed to fetch data' })
    }
}