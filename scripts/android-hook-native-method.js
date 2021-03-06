'use strict'

Interceptor.attach(Module.getExportByName("xxx.so" , "xxx"), {
    onEnter: function(args) {
        console.log("xxx called!");
    },
    onLeave:function(retval){
    
    }
});

var c = undefined;
var exports = Module.enumerateExportsSync("xxx.so");
for(var i=0;i<exports.length;i++){
    if(exports[i].name=="xxx"){
        c=exports[i].address;
        console.log("[***]xxx at "+c);
        break;
    }
}

var nativePointer=new NativePointer(c);
Interceptor.attach(nativePointer, {
    onEnter: function(args) {
        console.log("[***]xxx called!");
        var env=Java.vm.getEnv();
        console.log("args[2]: "+Java.cast(args[2],Java.use("java.lang.String")));
        console.log(args[3].toInt32());
    },
    onLeave:function(retval){
    	var env=Java.vm.getEnv();
    	var jstrings=env.newStringUtf("aaaaaaaaaaaaaaaaaaaaaa");
    	retval.replace(jstrings);
    	
    }
});


var pthread_create_addr = null;
  var symbols = Process.findModuleByName("libc.so").enumerateSymbols();
  for(var i = 0;i<symbols.length;i++){
      var symbol = symbols[i].name;
  
      if(symbol.indexOf("pthread_create")>=0){
          //console.log(symbols[i].name);
          //console.log(symbols[i].address);
          pthread_create_addr = symbols[i].address;
      }
  
  }
  console.log("pthread_create_addr,",pthread_create_addr);
  Interceptor.attach(pthread_create_addr,{
      onEnter:function(args){
          console.log("pthread_create_addr args[0],args[1],args[2],args[3]:",args[0],args[1],args[2],args[3]);

      },onLeave:function(retval){
          console.log("retval is:",retval)
      }
  })
