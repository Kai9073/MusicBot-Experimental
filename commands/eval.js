const Discord = require('discord.js')

module.exports = {
  name: 'eval',
  description: "eval",
  aliases: ["e"],
  run: async (client,message) => {
    try {
      const code = message.content.replace("m!eval ","");
      try { evaledPreformmat = eval(code) } catch(e) { 
        var er = new EvalError(e.message, 'eval.js', 12);
        var errmsg = `Error: ${er.name}: ${er.message}\n${e.stack}`
        return message.channel.send(errmsg, {code:"xl",split:true})
      }
      let evaled = JSON.stringify(evaledPreformmat, null, 2); 
      
      if (evaled == null||evaled == undefined||!evaled)
        evaled = "eval command failed"
      if(evaled.startsWith("{")|evaled.startsWith("[")) {format = "json"} else {format = "xl"}
      message.channel.send(evaled,{code:format,split:true})
    } catch (err) {
    console.log(err)
    message.channel.send(err)
    }
    
  }
}