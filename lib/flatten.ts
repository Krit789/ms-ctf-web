export function flattenObject(ob: Record<string, any>): Record<string, any> {
  var toReturn: Record<string, any> = {};

  for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) == 'object' && ob[i] !== null && !(ob[i] instanceof Date)) {
          var flatObject = flattenObject(ob[i]);
          for (var x in flatObject) {
              if (!flatObject.hasOwnProperty(x)) continue;

              toReturn[i + '_' + x] = flatObject[x];
          }
      } else {
          toReturn[i] = ob[i];
      }
  }
  return toReturn;
}