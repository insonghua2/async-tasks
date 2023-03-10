
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
                resolve(`???????????????`+item.id)
            },(3-i)*100);
        });
        const successList=res.filter((item)=>item.status==='fulfilled').map((item)=>item.value);
        expect(successList).toEqual(['???????????????1','???????????????2','???????????????3']);
    });

    test('waterfallList work in p1 p3 and reject p2', async() => {
        const res=await SkyPromise.waterfallList([1,2,3],(item:any,i:number,resolve:Function,reject:Function)=>{
            setTimeout(()=>{
                if(i!=1){
                    resolve(`p${i+1}`)
                }else{
                    reject(new Error(`p${i+1}????????????`))
                }
            },(3-i)*100);
        });
        const successList=res.filter((item)=>item.status==='fulfilled').map((item)=>item.value);
        const failList=res.filter((item)=>item.status==='rejected').map((item:any)=>item.reason.message);
        expect(successList).toEqual(['p1','p3']);
        expect(failList).toEqual(['p2????????????']);

    });


    test('all work in url1 url2 url3', async() => {
        const urls=["http://request1","http://request2","http://request3"]
        const res=await SkyPromise.allList(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
            // console.log('????????????'+url);
            setTimeout(()=>{
                const bool=true;
                if(bool){
                    resolve({code:0,data:`??????${i}`})
                }else{
                    reject(new Error(`???${i}???????????????`))
                }
            },100)
        });
        const data=res.map((item:any)=>item.data);
        expect(data).toEqual(['??????0','??????1','??????2']);
    });


    test('all work in url1 url3 and reject url2', async() => {
        const urls=["http://request1","http://request2","http://request3"]
        const res=await SkyPromise.allList(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
            // console.log('????????????'+url);
            setTimeout(()=>{
                if(i!=1){
                    resolve({code:0,data:`??????${i}`})
                }else{
                    reject(new Error(`???${i}???????????????`))
                }
            },100)
        });
        const data=res.map((item:any)=>item.data);
        expect(data).toEqual(['??????0','??????2']);
    });

    // test('allSettle work in url1 url2 url3', async() => {
    //     const urls=["http://request1","http://request2","http://request3"]
    //     const res=await SkyPromise.allSettle(urls,(url:string,i:number,resolve:Function,reject:Function)=>{
    //         // console.log('????????????'+url);
    //         setTimeout(()=>{
    //             if(i!=1){
    //                 resolve({code:0,data:`??????${i}`})
    //             }else{
    //                 reject(new Error(`???${i}???????????????`))
    //             }
    //         },100)
    //     });
    //     // console.log({res})
    //     const successList=res.filter((item:any)=>item.status==='fulfilled').map((item:any)=>item.value.data);
    //     const failList=res.filter((item:any)=>item.status==='rejected').map((item:any)=>item.reason.message);
    //     expect(successList).toEqual(['??????0','??????2']);
    //     expect(failList).toEqual(['???1???????????????']);
    // });
    test('chunkTask method work',async()=>{
        const tasks=[1,2,3,4,5,6,7,8,9,10].map((item:number,i:number)=>function(){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    // console.log(new Date(),`??????${i+1}`)
                    resolve(`??????${i+1}`)
                },i*10)
            })
        });
        const expectedResList=[1,2,3,4,5,6,7,8,9,10].map((item,i)=>`??????${i+1}`)
        // npm config set registry https://registry.npmmirror.com
        const res=await SkyPromise.chunkTask(tasks,3,1000);
        const flattedRes=SkyUtils.flat(res)
        expect(res.length).toEqual(4);
        expect(flattedRes.length).toEqual(10);
        expect(flattedRes).toEqual(expectedResList);
    })
   
  });
  

