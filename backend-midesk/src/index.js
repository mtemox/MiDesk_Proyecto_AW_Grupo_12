import app from './server.js';
import { connectDB } from './database.js';
import { startRecommendationsCron } from "./jobs/recommendations.cron.js";
connectDB();
startRecommendationsCron();


app.listen(app.get('port'), ()=> {
    console.log(`server ok on http://localhost:${app.get('port')}`)
})