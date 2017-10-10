/**
 * Created by chu on 2017/10/10 0010.
 */
const EventListener = function (obj) {
  let Regsiter = {};
  obj.on = function (name , method) {
    if (!Regsiter.hasOwnProperty(name)){
      Regsiter[name] = [];
    }
    Regsiter[name].push(method);
  };
  obj.fire = function (name) {
    if (Regsiter.hasOwnProperty(name)){
      let handlerList = Regsiter[name];
      for  (let i = 0 ; i < handlerList.length ; i ++){
        let handler = handlerList[i];
        let args = [];
        for (let j = 1 ; j < arguments.length ;j ++){
          args.push(arguments[j]);
        }
        handler.apply(this, args);
      }
    }
  };
  obj.off = function (name, method) {
    if (Regsiter.hasOwnProperty(name)){
      let handlerList = Regsiter[name];
      for (let i = 0 ; i < handlerList.length ; i ++){
        if (handlerList[i] === method){
          handlerList.splice(i, 1);
        }
      }
    }
  };
  return obj
};
export default EventListener;