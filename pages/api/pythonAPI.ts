import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const input_story = req.body.story;
        console.log("hello api")
        
        exec(`/Users/putubgs/Developer/talkup_chat/myenv/bin/python3 /Users/putubgs/Developer/talkup_chat/src/nlp/storyNLP.py "${input_story}"`, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return res.status(500).json({ error: stderr });
            }
            return res.status(200).json({ result: stdout });
        });
    } else {
        res.status(405).json({ error: 'We only support POST requests' });
    }
}