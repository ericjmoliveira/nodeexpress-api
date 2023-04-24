import express from 'express';

import { playerRouter } from './routes/player';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(playerRouter);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
