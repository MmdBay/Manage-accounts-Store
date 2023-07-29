# The following technologies are used in this project

- React Js
- Express Js
- Telegraf Js
- Styled Components
- SqLite DB

## The following libraries are also used

- axios
- body-parser
- cheerio
- dotenv
- express-rate-limit
- express-session
- helmet
- http-status-codes
- moment
- tough-cookie
- react-modal
- react-router-dom
- react-spinners
- react-toastify
- dompurify

# features
- Backup every change and send the file along with the changes in Telegram to the bot admin
- Back up to transfer.sh soon
- Using RestApi straight and stylish
- Easy and stylish management

## Follow the steps below to get started


#### NOTE: To run the project in developer mode, edit the .env file on the front-end side and set the value to **DEV**. To run the project in production mode, set the same value to **PROD** and then try to build.

Also, after getting the build on the front-end side, move the Build folder to the server directory.

## Implementation steps
download project and initial requirements

in both server and frontend sections
```
npm install
```
Run to install requirements and packages.

### Setting server-side .env values
You must replace the following values ​​with your own information

- PORT= Port
- BOT_TOKEN= Telegeram Bot Token
- BOT_ADMIN= Telegeram ChatId Admin Bot
- USER_NAME= user name
- PASSWORD=1 password
- NODE_ENV=DEV

### Follow the steps below to get an SSL security certificate

Download and install the Acme script for getting a free SSL certificate:

```
curl https://get.acme.sh | sh
```

Set the default provider to Let’s Encrypt:

```
~/.acme.sh/acme.sh --set-default-ca --server letsencrypt
```

Register your account for a free SSL certificate. In the next command, replace mohammad@gmail.com by your actual email address:

```
~/.acme.sh/acme.sh --register-account -m mohammad@gmail.com
```

Obtain an SSL certificate. In the next command, replace mmd.bay.com by your actual host name:

```
~/.acme.sh/acme.sh --issue -d mmd.bay.com --standalone
```

After a minute or so, the script terminates. On success, you will receive feedback as to the location of the certificate and key:

```
Your cert is in: /root/.acme.sh/mmd.bay.com/mmd.bay.com.cer
Your cert key is in: /root/.acme.sh/mmd.bay.com/mmd.bay.com.key
The intermediate CA cert is in: /root/.acme.sh/mmd.bay.com/ca.cer
And the full chain certs is there: /root/.acme.sh/mmd.bay.com/fullchain.cer

```

You cannot use the certificate and key in their current locations, as these may be temporary. Therefore install the certificate and key to a permanent location. In the next command, replace mmd.bay.com by your actual host name:

```
~/.acme.sh/acme.sh --installcert -d mmd.bay.com --key-file /root/private.key --fullchain-file /root/cert.crt
```

You can give the address of the root directory of your server side code so that the files are saved there.

Now you can set your KEY and CRT in the following code so that in production mode it only uses SSL requests so that the whole program is encrypted.

```
if (process.env.NODE_ENV === 'PRO') {
  const httpsOptions = {
    cert: fs.readFileSync('./cert.crt'),
    key: fs.readFileSync('./private.key')
  };
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
```

## Commands to run the program

Running the front end in developer mode :
```
npm start
```

Build from the project :
```
npm run build
```

Running the server side program in developer mode :
```
npm run dev
```

Running the server side program in production mode :
```
npm run prod
```

You can use Linux tool [Tmux](https://tmuxcheatsheet.com/) to run, But my suggestion is to use the [pm2](https://pm2.keymetrics.io/) library, a wonderful tool for monitoring and running your program in the background server.


### If you encounter an error with the momentJs library, install the requirements once with this command

```
npm install jalali-moment moment-timezone
```

If you see a problem or bug, please open issues and report 🤍