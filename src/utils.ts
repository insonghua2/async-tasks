




export function chunk(arr:any[],chunkSize:number):any[]{
    if(chunkSize>=arr.length){
        return [arr];
    }
    const copyArr=[...arr];
    const res:any[]=[];
    while(copyArr.length>0){
        const chunkArr=copyArr.splice(0,chunkSize);
        res.push(chunkArr);
    }
    return res;
}

export function sleep(delay:number){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("done");
        },delay)
    })
 
}

export function flat(arr:any[]){
    const exec=function(arr:any[],ret:any[]){
        arr.forEach((item:any)=>{
            if(Array.isArray(item)){
                exec(item,ret)
            }else{
                ret.push(item);
            }
        })
    }
    const ret:any[]=[];
    exec(arr,ret);
    return ret;
 
}









