import { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const filePath = path.resolve('./public/prizes/The Mental Health.pdf');
    const stat = fs.statSync(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename=The Mental Health.pdf`);

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
