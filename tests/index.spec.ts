
import {describe, expect, test} from '@jest/globals';
import * as SkyPromise from '../src/index';
import * as SkyUtils from '../src/utils';




describe('sky-promise module', () => {

  
    test('waterfall work in p1 p2 p3', async() => {
        const p1=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data1")
            },3000)
        })
        let p2=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data2")
            },1000)
        })
        const p3=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data3")
            },500)
        })
        const res=await SkyPromise.waterfall([p1,p2,p3]);
        const successList=res.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value);
        expect(successList).toEqual(['data1','data2','data3']);
    });
    test('waterfall work in p1 p3,and reject p2', async() => {
        const p1=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data1")
            })
        })
        const p2=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject(new Error('data2 failed'))
            })
        })
        const p3=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data3")
            })
        })
        const res=await SkyPromise.waterfall([p1,p2,p3]);
        const successList=res.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value);
        const failList=res.filter((item:any)=>item.status==='rejected').map((item:any)=>item.reason.message);
        
        expect(successList).toEqual(['data1','data3']);
        expect(failList).toEqual(['data2 failed']);

    });
    test('waterfallList work in p1 p2 p3', async() => {
        const res=await SkyPromise.waterfallList([1,2,3],(item:any,i:number,resolve)=>{
            setTimeout(()=>{
                const data:string=`p${i+1}`
                resolve(data)
            },(3-i)*100);
        });
        const successList=res.filter((item)=>item.status==='fulfilled').map((item)=>item.value);
        expect(successList).toEqual(['p1','p2','p3']);
    });

  


    test('waterfallList work in p1 p2 p3 with id', async() => {
        const res=await SkyPromise.waterfallList([{id:1,name:'foo'},{id:2,name:'bar'},{id:3,name:'zoo'}],(item,i:number,resolve:Function)=>{
           
            setTimeout(()=>{
                // updateItem()
                resolve(`成功处理了`+item.id)
            },(3-i)*100);
        });
        const successList=res.filter((item)=>item.status==='fulfilled').map((item)=>item.value);
        expect(successList).toEqual(['成功处理了1','成功处理了2','成功处理了3']);
    });

    test('waterfallList work in p1 p3 and reject p2', async() => {
        const res=await SkyPromise.waterfallList([1,2,3],(item:any,i:number,resolve:Function,reject:Function)=>{
            setTimeout(()=>{
                if(i!=1){
                    resolve(`p${i+1}`)
                }else{
                    reject(new Error(`p${i+1}任务出错`))
                }
            },(3-i)*100);
        });
        const successList=res.filter((item)=>item.status==='fulfilled').map((item)=>item.value);
        const failList=res.filter((item)=>item.status==='rejected').map((item:any)=>item.reason.message);
        expect(successList).toEqual(['p1','p3']);
        expect(failList).toEqual(['p2任务出错']);

    });

    test('all work in p1 p2 p3', async() => {
        const p1=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data1")
            })
        })
        const p2=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject(new Error('data2 failed'))
            })
        })
        const p3=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data3")
            })
        })
        const res=await SkyPromise.all([p1,p2,p3])
        expect(res).toEqual(['data1','data3']);
    });


    test('allSettle work in p1 p2 p3', async() => {
        const p1=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data1")
            })
        })
        const p2=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject(new Error('data2 failed'))
            })
        })
        const p3=()=>new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("data3")
            })
        })
        const res=await SkyPromise.allSettle([p1,p2,p3])
        const successList=res.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value);
        const failList=res.filter((item:any)=>item.status==='rejected').map((item:any)=>item.reason.message);
        expect(successList).toEqual(['data1','data3']);
        expect(failList).toEqual(['data2 failed']);
    });
   

    test('allList work in url1 url2 url3', async() => {
        const urls=["http://request1","http://request2","http://request3"]
        const res=await SkyPromise.allList(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
            // console.log('开始请求'+url);
            setTimeout(()=>{
                const bool=true;
                if(bool){
                    resolve({code:0,data:`数据${i}`})
                }else{
                    reject(new Error(`第${i}个请求出错`))
                }
            },100)
        });
        const data=res.map((item:any)=>item.data);
        expect(data).toEqual(['数据0','数据1','数据2']);
    });

    


    

    

    test('allList work in url1 url3 and reject url2', async() => {
        const urls=["http://request1","http://request2","http://request3"]
        const res=await SkyPromise.allList(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
            // console.log('开始请求'+url);
            setTimeout(()=>{
                if(i!=1){
                    resolve({code:0,data:`数据${i}`})
                }else{
                    reject(new Error(`第${i}个请求出错`))
                }
            },100)
        });
        const data=res.map((item:any)=>item.data);
        expect(data).toEqual(['数据0','数据2']);
    });

    test('allSettleList work in url1 url2 url3', async() => {
        const urls=["http://request1","http://request2","http://request3"]
        const res=await SkyPromise.allSettleList(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
            setTimeout(()=>{
                if(i!=1){
                    resolve({code:0,data:`数据${i}`})
                }else{
                    reject(new Error(`第${i}个请求出错`))
                }
            },100)
        });
        // console.log({res})
        const successList=res.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value.data);
        const failList=res.filter((item:any)=>item.status==='rejected').map((item:any)=>item.reason.message);
        expect(successList).toEqual(['数据0','数据2']);
        expect(failList).toEqual(['第1个请求出错']);
    });
    test('chunkTask method work',async()=>{
        const tasks=[1,2,3,4,5,6,7,8,9,10].map((item:number,i:number)=>function(){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    // console.log(new Date(),`数据${i+1}`)
                    resolve(`数据${i+1}`)
                },i*10)
            })
        });
        const expectedResList=[1,2,3,4,5,6,7,8,9,10].map((item,i)=>`数据${i+1}`)
        // npm config set registry https://registry.npmmirror.com
        const res=await SkyPromise.chunkTask(tasks,3,1000);
        const flattedRes=SkyUtils.flat(res)
        expect(res.length).toEqual(4);
        expect(flattedRes.length).toEqual(10);
        expect(flattedRes).toEqual(expectedResList);
    })

    test('chunkSettle method work',async()=>{
        const tasks=[1,2,3,4,5,6,7,8,9,10].map((item:number,i:number)=>function(){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    // console.log(new Date(),`数据${i+1}`)
                    // const flag=Math.random()>0.5
                    if(item!=3){
                        resolve(`数据${item}`)
                    }else{
                        reject(new Error(`数据${item}请求出错`))
                    }
                },i*10)
            })
        });
        const expectedResList=[1,2,4,5,6,7,8,9,10].map((item,i)=>`数据${item}`)
        // npm config set registry https://registry.npmmirror.com
        const res=await SkyPromise.chunkSettle(tasks,3,1000);
        const flattedRes=SkyUtils.flat(res)
        expect(res.length).toEqual(4);
        expect(flattedRes.length).toEqual(10);
        const successList=flattedRes.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value);
        const failList=flattedRes.filter((item:any)=>item.status==='rejected').map((item:any)=>item.reason.message);
        expect(successList.length+failList.length).toEqual(10);
        expect(successList).toEqual(expectedResList);
        expect(failList).toEqual(['数据3请求出错']);
    })
});

