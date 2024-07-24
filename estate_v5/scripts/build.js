const exec = require('child_process').exec
const version = require('../package.json').version
const date = new Date()
const name = `estate_v5_${version}_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.tar.gz`
// tar -cf estate_V5_yyyymmdd.tar.gz  ./dist
exec(`tar -zcvf ${name} ./estate_v5`, err => {
  if (err) {
    return console.log(err)
  }
  console.log('success')
})
