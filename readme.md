Duplicate this repo

add an image named "icon.png"

upload to render.com as a web service

environment: node

build command: npm install

start command: npm start

add environment variables:
- PROXY_SECRET = random code
- ROBLOX_API_KEY_GAMEPASS = your Roblox API key that has gamepass - write permission 

-- call the API --
- method = POST
- url = https://your-service-name.onrender.com/create-gamepass
- headers:
```
Content-Type = application/json
x-proxy-auth = your secret code that you used for the "PROXY_SRCRET" variable
```
- body:
```
{
"name": "the gamepass name",
"price": "the gamepass price",
"universeId": "the id Roblox gave for your game",
"description": "the gamepass description"
}
```