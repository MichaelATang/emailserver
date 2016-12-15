/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// [START setup]
const Mailgun = require('mailgun').Mailgun;
const mg = new Mailgun(process.env.MAILGUN_API_KEY);
// [END setup]

const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// [START index]
app.get('/', (req, res) => {
  res.render('index');
});
// [END index]

// [START hello]
app.post('/hello', (req, res, next) => {
  const servername = '';
  const options = {};
  
 mg.sendText(
    // From
    req.body.from,
    // To
    req.body.to,
    // Subject
    //'Mail From Contact Page',
    req.body.subject,
    // Body
    //'Mailgun on Google App Engine with Node.js',
    req.body.message,
    servername,
    options,
    (err) => {
      if (err) {
        next(err);
        return;
      }
      // Render the index route on success
      res.render('index', {
        sent: true
      });
    }
  );
});
// [END hello]

// [START server]
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END server]
