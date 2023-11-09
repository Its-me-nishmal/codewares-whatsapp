var express = require('express');
var router = express.Router();
const uuid = require('uuid')
const venom = require('venom-bot');
const fs = require('fs');

// Set Handlebars as the view engine

// Your existing route to create a session and generate the QR code
router.get('/', (req, res) => {
    const sessionName = uuid.v4();

    venom.create(
        sessionName,
        (base64Qr, asciiQR, attempts, urlCode) => {
            // Save the QR code image to a file (out.png)
            // ...
            var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
    
          if (matches.length !== 3) {
            return new Error('Invalid input string');
          }
          response.type = matches[1];
          response.data = new Buffer.from(matches[2], 'base64');
    
          var imageBuffer = response;
          require('fs').writeFile(
            'out2.png',
            imageBuffer['data'],
            'binary',
            function (err) {
              if (err != null) {
                console.log(err);
              }
            }
          );

            // Render the HBS template after a short delay for the animation
            setTimeout(() => {
                res.render('qr'); // Render the HBS template
            }, 10000); // Adjust the delay as needed
        },
        undefined,
        { logQR: false }
    )
    .then((client) => {
        start(client);
        res.send(`New session created with name: ${sessionName}`);
    })
    .catch((erro) => {
        console.log(erro);
        res.status(500).send('Error creating a new session.');
    });
});

const path = require('path');
router.get('/out2.png', (req, res) => {
  const imagePath = path.join(__dirname, '../', 'out2.png');
  res.sendFile(imagePath);
});



function start(client) {
  client.onMessage(async(message) => {
    if (message.body === 'codewars' && message.isGroupMsg === false) {
      client
        .sendText(message.from, await testing())
        .then((result) => {
          console.log('Result: ', ); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}

const usersData = {
  "Nishmal": "Its-me-nishmal",
  "Amal Nath": "AmalNath-VS",
  "Fahim": "muhammmedfahim4321",
  "Abdul Bari": "Abdulbarikt",
  "Afaf": "Afaf997",
  "Subhin": "SUBHIN-TM",
  "Rifna": "Rifna",
  "Afsal Kp": "Afsalkp7",
  "Jeeva": "Jeevamk",
  "Krishnadas": "Krishnadas3",
  "Adhila Millath": "adila millath"
};
async function testing() {
  const responseMessages = [];
  responseMessages.push("╭────《 𝕔𝕠𝕕𝕖𝕨𝕒𝕣𝕖𝕤 𝕥𝕠𝕕𝕒𝕪 》────⊷\n│╭──────✧❁✧──────◆");

  for (const user in usersData) {
    const codeWarsUsername = usersData[user];

    try {
      const challengesResponse = await fetch(`https://www.codewars.com/api/v1/users/${codeWarsUsername}/code-challenges/completed`);
      const challengesData = await challengesResponse.json();

      // Calculate completed challenges today
      const today = new Date().toISOString().split('T')[0];
      const completedToday = challengesData.data.filter(challenge => challenge.completedAt.startsWith(today));

      // Construct the response message for this user
      const responseMessage = `│   ${user} :- ${completedToday.length}`;
      responseMessages.push(responseMessage);
    } catch (error) {
      console.error('An error occurred:', error);

      // Check if the error message is user-friendly or not
      let errorMessage = `An error occurred while processing data for ${user}. Please try again later.`;

      if (error.message) {
        // If the error has a message, you can include it in the response
        errorMessage += ` Error details: ${error.message}`;
      }

      responseMessages.push(errorMessage);
    }
  }

  responseMessages.push("│╰──────✧❁✧──────◆\n╰══════════════════⊷");

  return responseMessages.join('\n');
}

module.exports = router;
