const fs = require('fs');

export default function handler(req, res) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }
    let msg = 'Success';
    try {
        fs.unlink('../../public/mp3s/*', (err) => {
            throw new Error(e);
        });
    } catch(e) {
        msg = `Failure - ${e}`;
    }
    res.status(200).end(msg);
}