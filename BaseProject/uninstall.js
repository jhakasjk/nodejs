var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'NodeJs Base WebApp',
  script: 'E:\\Projects\\Web\\GitHub\\BaseProject-NodeJs\\nodejs\\BaseProject\\bin\\www'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();
