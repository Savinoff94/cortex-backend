# CORTEX TEST DESCRIPTION
ATTENTION: you should have firebase client
- open terminal, run
```js
git clone https://github.com/Savinoff94/cortex-backend.git
```
```js
cd ./cortex-backend/functions
```
```js
npm install
```

- create .env file in functions folder
- fill in with variable: 

```js
IS_DEV=true
```
- open new terminal in this folder, go 
```js
cd ../
```
- run 
```js
firebase emulators:start
```

- in ANOTHER terminal wich still in /functions folder, run following line to seed traffic data 
```js
npm run seed
```
- now you should be able to run application locally. But make sure that frontend runned on PORT 5173, if not cors will prevent connection.
if there will be problems you can substitute

```js
const corsOptions = {
	origin: [
		"http://localhost:5173",
		"https://cortexfrontend.netlify.app",
	],
	credentials: true,
};
```

with

```js
const corsOptions = { origin: true }
```