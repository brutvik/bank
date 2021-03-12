# bank
meteor add accounts-password
meteor --allow-incompatible-update add iron:router 
meteor add session
DEPLOY_HOSTNAME=galaxy.meteor.com meteor --free deploy bank.meteorapp.com --settings <path to settings.json>/settings.json
