[![npm](https://img.shields.io/npm/v/ins-async-tasks.svg?style=flat-square)](https://www.npmjs.com/package/ins-async-tasks)
[![Coverage Status](https://coveralls.io/repos/github/insonghua2/async-tasks/badge.svg?branch=master)](https://coveralls.io/github/insonghua2/async-tasks?branch=master)
[![npm](https://img.shields.io/npm/dt/ins-async-tasks.svg?style=flat-square)](https://www.npmjs.com/package/ins-async-tasks)
![npm bundle size](https://img.shields.io/bundlephobia/min/ins-async-tasks)

<!-- [![Build Status](https://app.travis-ci.com/insonghua2/async-tasks.svg?branch=master)](https://app.travis-ci.com/insonghua2/async-tasks) -->

# ins-async-task
`ins-async-task` is a lightweight npm library that simplifies handling asynchronous tasks in JavaScript and TypeScript. It provides a set of utility functions to manage asynchronous operations effectively.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [waterfall](#waterfall)
  - [all](#all)
  - [chunkTask](#chunktask)

- [MORE API](#api)
  - [waterfallList](#waterfalllist)
  - [allList](#alllist)
  - [allSettle](#allsettle)
  - [allSettleList](#allsettlelist)
  - [chunkSettle](#chunksettle)

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
### API

### data structure information
define settledValue,task,tasks
```javascript
    const task=()=>new Promise((resolve,reject)=>{})
    const tasks=[task]
    const settledValue=[
        {
            status: 'fulfilled',
            value:"your resolved data can be string or any object",
        },
          {
            status: 'rejected',
            reason:new Error('error detail message')
        },
        {
            status: 'fulfilled',
            value:"your resolved data can be string or any object",
        }
    // ]
```
### waterfall()
Different types of tasks will be executed in ways of serial
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 &emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;Task3 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--->|<br/>
```typescript
    const res=await AsyncTasks.waterfall([task1,task2,task3])
    // res is settledValue;
```

### all()
Different types of tasks will be executed in ways of parallel and ignore error
> Effect：<br/>
        &emsp;&emsp;Task1 ----->| <br/>
        &emsp;&emsp;Task2 -------->| <br/>
        &emsp;&emsp;Task3 --->| <br/>
```typescript
    const res=await AsyncTasks.all([task1,task2,task3])
    // if task2 has error, res=["data1","data3"]
```

### chunkTask()
Large numbers of Tasks chunked with group and Executed,the tasks in group are executed in parallel,different groups are in serial. error will be ignored.
> Effect：<br/>
        &emsp;&emsp;Group1 <br/>
            &emsp;&emsp;&emsp;&emsp;Task1 ----->| <br/>
            &emsp;&emsp;&emsp;&emsp;Task2 -------->| <br/>
            &emsp;&emsp;&emsp;&emsp;Task3 --->| <br/>
        &emsp;&emsp;Wait &emsp;&emsp;&emsp;&emsp; &emsp;&emsp;&emsp;|-->|<br/>
        &emsp;&emsp;Group2 <br/>
        &emsp;&emsp;&emsp;&emsp;Task4   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----->| <br/>
        &emsp;&emsp;&emsp;&emsp;Task5   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;&emsp;&emsp;Task6 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----------->| <br/>
        &emsp;&emsp;Wait  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp;&emsp;&emsp; &emsp; &emsp;&emsp;|-->| <br/>
        &emsp;&emsp;&emsp;&emsp;Task7 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ---------->| <br/>
```typescript
    //group chunked with 3 tasks,and sleep for 1000 milliseconds between different groups;

    const res=await AsyncTasks.chunkTask(tasks,3,1000)
    // res=[
    //     [ "data1","data2","data3"],
    //     ["data4","data5","data6"],
    //     [,"data7"],
    // ]
    const flatResult=res.flat();
    // flatResult=["data1","data2","data3","data4","data5","data6","data7"]
```



### waterfallList()
Compose and execute tasks from array in ways of serial
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
    // res is settledValue;
```


### allList()
Compose and execute tasks from array in ways of parallel and ignore error
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
    // res=['data1','data3']
```


### allSettleList()
Different types of tasks will be executed in ways of parallel
the same effect with AsyncTasks.allList but return settled value
```typescript
    const list=[1,2,3]
    const res=await AsyncTasks.allSettleList(list,(item,i,resolve,reject)=>{
        if(i!=1){
            setTimeout(()=>{
                resolve(`data${i+1}`)
            },i*1000)
        }else{
            reject(new Error(`task with index of ${i} failed`)
        }
    })
    // res is settledValue;
```

### allSettle()
Different types of tasks will be executed in ways of parallel
the same effect with AsyncTasks.all but return settled value
```typescript
    const res=await AsyncTasks.all([task1,task2,task3])
    // res is settledValue;
```




### chunkSettle()
the same effect with chunkTask but catch all error and reject;

```typescript
    //group chunked with 3 tasks,and sleep for 1000 milliseconds between different groups;
    const res=await AsyncTasks.chunkSettle(tasks,3,1000)
    const flatResult=res.flat();
    // flatResult is settledValue

```