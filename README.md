[![npm](https://img.shields.io/npm/v/ins-async-tasks.svg?style=flat-square)](https://www.npmjs.com/package/ins-async-tasks)
[![Coverage Status](https://coveralls.io/repos/github/insonghua2/async-tasks/badge.svg?branch=master)](https://coveralls.io/github/insonghua2/async-tasks?branch=master)
[![npm](https://img.shields.io/npm/dt/ins-async-tasks.svg?style=flat-square)](https://www.npmjs.com/package/ins-async-tasks)
![npm bundle size](https://img.shields.io/bundlephobia/min/ins-async-tasks)

<!-- [![Build Status](https://app.travis-ci.com/insonghua2/async-tasks.svg?branch=master)](https://app.travis-ci.com/insonghua2/async-tasks) -->
> Simple And Easy to manage lots of async tasks in ways of Serial And Parallel
> provide five API as bellow:
> waterfall,waterfallList,all,allList,chuckTask
> exmaples in Usage


## Install
```
    npm install ins-async-tasks --save
```
 ## Usage
 ```js
    import * as AsyncTasks from 'ins-async-tasks';
    //or
    const AsyncTasks=require('ins-async-tasks');
 ```
### API examples

### waterfallList()
Compose and execute tasks from array in ways of serial
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 &emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;Task3 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--->|<br/>
         &emsp;&emsp;Exec  ---------------------->| <br/>

```typescript
    const list=[1,2,3]
    const res=await AsyncTasks.waterfallList(list,(item,i,resolve,reject)=>{
        if(i!=1){
            setTimeout(()=>{
                resolve(`data${i+1}`)
            },i*1000)
        }else{
            reject(new Error(`task with index of ${i} failed`)
        }
    })
    // res=[
    //     {
    //         status: 'fulfilled',
    //         value:"data1",
    //     },
    //       {
    //         status: 'rejected',
    //         reason:"Error:task with index of 1 failed"
    //     },
    //     {
    //         status: 'fulfilled',
    //         value:"data3",
    //     }
    // ]
```
### waterfall()
Different types of tasks will be executed in ways of serial
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 &emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;Task3 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--->|<br/>
         &emsp;&emsp;Exec  ---------------------->| <br/>
```typescript
    const task1=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // dosth
            resolve({foo:'data1'})
        },2000)
    })

     const task2=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // dosth
            resolve("data2")
        },1000)
    })
    const task3=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // dosth
            resolve("data3")
        },3000)
    })
    const res=await AsyncTasks.waterfall([task1,task2,task3])
    // res=[
    //     {
    //         status: 'fulfilled',
    //         value:{foo:'data1'},
    //     },
    //       {
    //         status: 'fulfilled',
    //         value: 'data2',
    //     },
    //     {
    //         status: 'fulfilled',
    //         value:"data3",
    //     }
    // ]

```

### allList()
Compose and execute tasks from array in ways of parallel
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 -------->| <br/>
        &emsp;&emsp;Task3 --->| <br/>
        &ensp;&ensp;&emsp;Exec --------->| <br/>
```typescript
    const list=[1,2,3]
    const res=await AsyncTasks.allList(list,(item,i,resolve,reject)=>{
        if(i!=1){
            setTimeout(()=>{
                resolve(`data${i+1}`)
            },i*1000)
        }else{
            reject(new Error(`task with index of ${i} failed`)
        }
    })
    // array from result only resolved in task
    // res=['data1','data3']
```

### all()
Different types of tasks will be executed in ways of parallel
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 -------->| <br/>
        &emsp;&emsp;Task3 --->| <br/>
        &ensp;&emsp;&emsp;Exec -------->| <br/>
```typescript
     const tasks=[1,2,3].map((item)=>{
        const task=()=>{
            return new Promise((resolve, reject)=>{
            const delay=Math.random()*1000;
            setTimeout(()=>{
                    resolve(`data${item}`)
                },delay)
            });
        }
        return task;
    })
    const res=await AsyncTasks.all([task1,task2,task3])
    // res=["data1","data2","data3"]
```


### chunkTask()
Large numbers of Tasks chunked with group and Executed,the tasks in group are executed in parallel,different groups are in serial.
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 -------->| <br/>
        &emsp;&emsp;Task3 --->| <br/>
        &emsp;&emsp;Group1 -------->| <br/>
        &emsp;Wait  &emsp; &emsp;&emsp;&emsp; &emsp; &emsp;|-->| <br/>
        &emsp;&emsp;Task4   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----->| <br/>
        &emsp;&emsp;Task5   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;Task6 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----------->| <br/>
        &emsp;&emsp;Group2 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;------------>| <br/>
        &emsp;Wait  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp;&emsp;&emsp; &emsp; &emsp;|-->| <br/>
        &emsp;&emsp;Task7 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----------->| <br/>
```typescript
    //group chunked with 3 tasks,and sleep for 1000 milliseconds between different groups;
    const tasks=[1,2,3,4,5,6,7].map((item)=>{
        const task=()=>{
            return new Promise((resolve, reject)=>{
            const delay=Math.random()*1000;
            setTimeout(()=>{
                    resolve(`data${item}`)
                },delay)
            });
        }
        return task;
    })

    const res=await AsyncTasks.chunkTask(tasks,3,1000)
    // res=[
    //     [ "data1","data2","data3"],
    //     ["data4","data5","data6"],
    //     [,"data7"],
    // ]
    const flatResult=res.flat();
    // flatResult=["data1","data2","data3","data4","data5","data6","data7"]

```