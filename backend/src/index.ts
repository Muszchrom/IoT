import express from "express";
import morgan from "morgan";
import http from 'http';
import createWSServer from "./ws-server";

const app = express();
const server = http.createServer(app);
createWSServer(server);

app.use(morgan('dev'))
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
  if (req.method === 'OPTIONS') res.sendStatus(200)
  else next()
})


app.get('/api/', (req, res) => {
  res.status(200).json({message: "Hello world!"});
});


server.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});

