if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://Aditya:Adi@29071998@ds133865.mlab.com:33865/vidjot-prod'}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
  }