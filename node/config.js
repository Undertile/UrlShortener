var config = {};

config.S3 = {};
config.servidor = {};
config.local = {};

config.S3.CredentialsPath = '/etc/UrlShortener/credencialsS3.json';
//config.S3.Bucket = 'undertile-urlshort';
config.S3.Bucket = 'und.tl';
config.servidor.Port = 8080;
config.local.Path = 'localhost';
//config.local.Link = 'http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/';
//config.local.Link = 'http://und.tl.s3-website-eu-west-1.amazonaws.com/';
config.local.Link = 'http://und.tl/';
config.local.LongHash = 8;


module.exports = config;



