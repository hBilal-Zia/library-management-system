const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.status(200).send({message: "Server is Up!"})
})

app.listen(8080, () => {
	console.log('Server is listenign at port 8080')
})

