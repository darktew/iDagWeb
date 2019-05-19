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

const expoHost = "https://exp.host/--/api/v2/push/send";


app
  .prepare()
  .then(() => {
    const server = express()
    server.use(cors({ origin: true, allowedHeaders: true }));
    server.use(bodyParser.json());

    server.post('/api/sendNotiVote', (req,res) => {
          const userData = req.body.userData;
          userData.map((e,i) => {
              let notiPush = {
                to: e.tokenUser,
                title: "เปิดโหวตแล้วไปโหวตได้",
                body: `เวลาในการโหวต ${req.body.timeLimit} นาที`,
                sound: "default",
                channelId: "notice"
              }
        axios.post(expoHost, notiPush, {headers: {"Access-Control-Allow-Origin": "*"}}).then((res) => {
            console.log('sucess')
          }).catch(err => {
            console.error(err)
          }) 
      }) 
    })

    server.post('/api/votelist', (req,res) => {
     cron.schedule(`
      ${moment(new Date(req.body.timeCount)).minute()} 
      ${moment(new Date(req.body.timeCount)).hour()} * * *`, () => {
        axios.post('https://us-central1-idagdb.cloudfunctions.net/endVote', {
          channelId: req.body.channelId,
          timeCount: req.body.timeCount
      }, {headers: {"Access-Control-Allow-Origin": "*"}}).then((res) => {
          console.log("success");
        }).catch((err) => {
          console.error(err);
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