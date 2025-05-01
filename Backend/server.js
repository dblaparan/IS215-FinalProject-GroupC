import express from 'express'

const app = express()

app.use(express.static('front'))

app.get('s3url', (req, res) => {

})

app.listen(8080, () => console.log("listening on port 8080"))