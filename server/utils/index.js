let path = require('path')
let fs = require('fs')

function getParams (url = window.location.href) {
	let params = {}
  if (url && url.indexOf('?') !== -1 && url.indexOf('=') !== -1) {
		url.split('?')[1].split('&').forEach((li) => {
			let param = li.split('=')
			if (param.length > 1) {
				if (param[0].length > 0 && param[1].length > 0) {
					params[param[0]] = param[1]
				}
			}
		})
  }
  return params
}

function isEmptyObj (obj) {
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			return false
		}
	}
	return true
}

function fileUpload (files, targetDir, fileName) {
	if (!fs.existsSync(targetDir)) {  
		fs.mkdir(targetDir)
	}
	let readStream = fs.createReadStream(files.path)
	let writeStream = fs.createWriteStream(targetDir + path.sep + fileName)
	readStream.pipe(writeStream)
	readStream.on('end', () => {
		fs.unlinkSync(files.path)
	})
}

module.exports = {
  getParams,
	isEmptyObj,
	fileUpload
}