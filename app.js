const express = require('express')
const next = require('next')
const cors = require('cors')
const bodyParser = require('body-parser');
const moment = require('moment');
// const scheduler = require('@google-cloud/scheduler');
const axios = require('axios');
const cron = require('node-cron');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler();

// https://us-central1-idagdb.cloudfunctions.net/endNotifications

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(cors({ origin: true, allowedHeaders: true }));
    server.use(bodyParser.json());

    server.post('/api/votelist', async(req,res) => {
      console.log(req.body);
     cron.schedule(`
      ${moment(new Date(req.body.timeCount)).minute()} 
      ${moment(new Date(req.body.timeCount)).hour()} * * *`, () => {
        axios.post('http://localhost:5000/idagdb/us-central1/endNotifications', {
          channelId: req.body.channelId
        }).then((res) => {
          console.log("success");
        })
     }, {
       scheduled: true,
       timezone: 'Asia/Bangkok'
     })
     return res.json()
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })