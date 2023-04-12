
import {chunk,sleep} from './utils';

type Task=()=>Promise<any>;
type Iterator<T>=(item:T,index:number,resolve:Function,reject:Function)=>void;



export function waterfall(tasks:Task[]):Promise<[]>{
    let index=0;
    function next(resolve:Function,data:any[]):any{
        if(index<tasks.length){
            return tasks[index]()
            .then((res:any)=>{
                res&&data.push({status:'fulfilled',value:res});
            }).catch((error:any)=>{
                data.push({status:'rejected',reason:error});
            }).finally(()=>{
                index++;
                return next(resolve,data);
            })
        }
        //所有异步任务执行完后返回结果
        return resolve(data);
    }
    return new Promise((resolve)=>{
        next(resolve,[]);
    })
}

export function waterfallList<T>(list:T[],iterator:Iterator<T>):Promise<any[]>{
    const tasks:Task[]=promiseIterator(list,iterator)
    return waterfall(tasks);
}


// export function allSettle<T>(list:any[],iterator:Iterator<T>){
//     const tasks=list.map((item,i)=>new Promise(async(resolve,reject)=>{
//         try {
//             await iterator(item,i,resolve,reject);
//         } catch (error:any) {
//             reject(error)
//         }
//     }))

//     return Promise.allSettled(tasks);
// }



function _all(tasks:Task[],isCatchError=false):Promise<any[]>{
    let promiseList=[];
    while(tasks.length>0){
        const current:Task=tasks.shift() as Task;
        const newCurr=new Promise(((resolve)=>{
            current().then((data)=>{
                if(isCatchError){
                    data&&resolve({status:'fulfilled',value:data});
                }else{
                    resolve(data);
                }
            }).catch((error)=>{
                if(isCatchError){
                    resolve({status:'rejected',reason:error});
                }else{
                    resolve(undefined)
                }
            })
        }))
        promiseList.push(newCurr);
    }
    if(isCatchError){
        return Promise.all(promiseList)
    }else{
        return Promise.all(promiseList)
            .then((list)=>{
                return list.filter((item)=>!!item)
            })
    }

}


export function all(tasks:Task[]):Promise<any[]>{
    return _all(tasks,false)
}

export function allSettle(tasks:Task[]):Promise<any[]>{
    return _all(tasks,true)
}


function _chunkAll(tasks:Task[],chunkSize:number,delay:number,isCatchError:boolean):Promise<any[]>{
    const chunkTasks=chunk(tasks,chunkSize);

    let index=0;
    function next(resolve:Function,data:any[]):any{
        if(index<chunkTasks.length){
            return _all(chunkTasks[index],isCatchError)
            .then((res:any)=>{
                res&&data.push(res);
            }).finally(()=>{
                index++;
                sleep(delay).then(()=>{
                 // console.log(`还剩下${chunkTasks.length}组待完成`)
                    return next(resolve,data);
                });

            })
        }
        //所有异步任务执行完后返回结果
        return resolve(data);
    }
    return new Promise((resolve)=>{
        next(resolve,[]);
    })
}

export function chunkTask(tasks:Task[],chunkSize:number,delay:number):Promise<any[]>{
    return _chunkAll(tasks,chunkSize,delay,false)
}

export function chunkSettle(tasks:Task[],chunkSize:number,delay:number):Promise<any[]>{
    return _chunkAll(tasks,chunkSize,delay,true)
}

export function allList<T>(list:T[],iterator:Iterator<T>):Promise<any[]>{
    const tasks:Task[]=promiseIterator(list,iterator);
    return _all(tasks,false)
}

export function allSettleList<T>(list:T[],iterator:Iterator<T>):Promise<any[]>{
    const tasks:Task[]=promiseIterator(list,iterator);
    return _all(tasks,true)
}

/**
 * @description 生产Task的数组迭代器
 * @author neohua87@gmail.com
 * @date 04/01/2023
 * @param {T[]} list
 * @param {Iterator} iterator
 * @return {*}  {Task[]}
 */
function promiseIterator<T>(list:T[],iterator:Iterator<T>):Task[]{
    return list.map((item:T,i)=>function(){
        return new Promise((resolve,reject)=>{
                iterator(item,i,resolve,reject);
        })
    })
}

