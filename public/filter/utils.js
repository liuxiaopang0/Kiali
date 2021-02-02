export function stripSwitch(n,str) {
  switch(str) {
    case '万条':
       n=n*Math.pow(10,4)
       break;
    case '亿条':
       n=n*Math.pow(10,8)
       break;
    case '千亿条':
       n=n*Math.pow(10,11)
       break;
    case '万亿条':
       n=n/Math.pow(10,12)
       break;
    case '兆':
       n=n*Math.pow(10,13)
       break;
    case '万兆':
        n=n*Math.pow(10,18)
        break;
    case '京':
        n=n*Math.pow(10,19)
        break;
    case '万京':
        n=n*Math.pow(10,23)
        break;
    default:
        n=!n?'':parseFloat(n)
  }
  //return n.toLocaleString().split(',').join('')
  return n
}
export function stripReturn(n) {
   var l=n.toString().length
   if(l>=13){
      l=[n/Math.pow(10,13),'兆']
   }else if(5<l && l<13){
      l=[n/Math.pow(10,4),'万条']
   }else{
      l=[n,'条']
   }
   l[0]=parseInt(l[0])
   //l[0]=parseInt(l[0].toLocaleString().split(',').join('')).toLocaleString().split(',').join('')
   return l
 }
 export function kbSwitch(n,str) {
   switch(str) {
     case 'B':
        n=n/Math.pow(1024,1)
        break;
     case 'MB':
        n=n*Math.pow(1024,1)
        break;
     case 'GB':
        n=n*Math.pow(1024,2)
        break;
     case 'TB':
        n=n/Math.pow(1024,3)
        break;
     case 'PB':
        n=n*Math.pow(1024,4)
        break;
     case 'EB':
         n=n*Math.pow(1024,5)
         break;
     case 'ZB':
         n=n*Math.pow(1024,6)
         break;
     case 'YB':
         n=n*Math.pow(1024,7)
         break;
     case 'BB':
         n=n*Math.pow(1024,8)
         break;
     case 'NB':
         n=n*Math.pow(1024,9)
         break;
     case 'DB':
         n=n*Math.pow(1024,10)
         break;
     default:
      n=!n?'':parseFloat(n)
   }
   //return n.toLocaleString().split(',').join('')
   return n
 }
 export function kbReturn(n) {
   var l=parseInt(n).toString().length
   if(l>=25){
      l=[n/Math.pow(1024,8),'BB']
   }else if(15<=l && l<25){
      l=[n/Math.pow(1024,5),'EB']
   }else if(7<=l && l<15){
      l=[n/Math.pow(1024,2),'GB']
   }else{
      l=[n,'kb']
   }
   l[0]=l[0].toFixed(2)
   //l[0]=parseInt(l[0].toLocaleString().split(',').join('')).toLocaleString().split(',').join('')
   return l
 }
export var nData=[
  {l:'条',v:'条'},{l:'万条',v:'万条'},{l:'亿条',v:'亿条'},{l:'千亿条',v:'千亿条'},{l:'万亿条',v:'万亿条'},{l:'兆',v:'兆'},{l:'万兆',v:'万兆'},{l:'京',v:'京'},{l:'万京',v:'万京'}
]
export var mData=[
  {l:'B',v:'B'},{l:'KB',v:'KB'},{l:'MB',v:'MB'},{l:'GB',v:'GB'},{l:'TB',v:'TB'},{l:'PB',v:'PB'},{l:'EB',v:'EB'},{l:'ZB',v:'ZB'},{l:'YB',v:'YB'},{l:'BB',v:'BB'},{l:'NB',v:'NB'},{l:'DB',v:'DB'}
]