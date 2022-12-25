const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
//const create = (process.argv.length == 5)

const url = `mongodb+srv://fullstack_user:${password}@cluster0.40uxlhm.mongodb.net/Phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url).then((result) => { console.log('connected')})

if(process.argv.length == 5){
        const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        })
        person.save().then(result => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        }).catch((err) => console.log(err))
}else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(person.name,person.number)
        })
        return mongoose.connection.close()
    }).catch((err) => console.log(err)) 
}

