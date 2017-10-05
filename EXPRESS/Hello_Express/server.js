const express = require("express")
const path = require("path")

const app = express()

const PORT = 8000

app.set("views", path.join(__dirname, "./client/views"))
app.set("view engine", "ejs")

app.get("/", (request, response) => {
	let context = {
    name:'Rhett',
    nums: [1,2,3,4]
  }

	response.render("index", context)
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
