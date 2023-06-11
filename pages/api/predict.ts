import { spawn } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { story } = req.body;
    const pythonProcess = spawn('python3', ['../src/app/nlp/storyNLP.py', story]);

    pythonProcess.stdout.on('data', (data) => {
      // Do something with the data returned from the python script
      res.status(200).json({ category: data.toString() });
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
