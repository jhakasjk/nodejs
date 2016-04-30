var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'NodeJs Base WebApp',
  description: 'The sample nodejs web server.',
  script: 'E:\\Projects\\Web\\GitHub\\BaseProject-NodeJs\\nodejs\\BaseProject\\bin\\www'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();