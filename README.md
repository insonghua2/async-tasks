

> Simple And Easy to manage lots of async tasks in ways of Serial And Parallel


## Install
```
    npm install ins-async-tasks --save
```
 ## Usage
### 引入
 ```js
    import * as AsyncTasks from 'ins-async-tasks';
    //or
    const AsyncTasks=require('ins-async-tasks');
 ```

### 数组任务串行
> 效果：<br/>
        &emsp;&emsp;P1 ----->| <br/>
        &emsp;&emsp;P2 &emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;P3 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--->|<br/>
         &emsp;Exec  --------------------->| <br/>

```typescript
    const list=[1,2,3]
    const res=await AsyncTasks.waterfallList(list,(item,i,resolve,reject)=>{
        //dosth resolve(结果)或者reject(new Error('sth wrong))
    })
```
### 数组任务串行更灵活的子集构造不同的处理函数(更通用灵活)
> 效果：<br/>
        &emsp;&emsp;A ----->| <br/>
        &emsp;&emsp;B &emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;C &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--->|<br/>
         &emsp;Exec  -------------------->| <br/>
```typescript
    const task1=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("data1")
        },2000)
    })

     const task2=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("data2")
        },1000)
    })
    const task3=()=>new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("data3")
        },3000)
    })
    const res=await AsyncTasks.waterfall([task1,task2,task3])
```

### 数组任务并行,获取成功的结果列表
> 效果：<br/>
        &emsp;&emsp;P1 ----->| <br/>
        &emsp;&emsp;P2 -------->| <br/>
        &emsp;&emsp;P3 --->| <br/>
        &ensp;&ensp;Exec -------->| <br/>
```typescript
    const list=[1,2,3]
    const res=await AsyncTasks.allList(list,(item,i,resolve,reject)=>{
        //dosth resolve(结果)或者reject(new Error('sth wrong))
    })
```

### 数组任务并行，灵活通用版
> 效果：<br/>
        &emsp;&emsp;A ----->| <br/>
        &emsp;&emsp;B -------->| <br/>
        &emsp;&emsp;C --->| <br/>
        &ensp;Exec -------->| <br/>
```typescript
    const res=await AsyncTasks.all([task1,task2,task3])
```


### 超大长度数组任务分组并行，组内并行，组之间串行
> 效果：<br/>
        &emsp;&emsp;P1 ----->| <br/>
        &emsp;&emsp;P2 -------->| <br/>
        &emsp;&emsp;P3 --->| <br/>
        &emsp;&emsp;G1 -------->| <br/>
        &emsp;Wait  &emsp; &emsp; &emsp; &emsp;|-->| <br/>
        &emsp;&emsp;P4   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----->| <br/>
        &emsp;&emsp;P5   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-------->| <br/>
        &emsp;&emsp;P6 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----------->| <br/>
        &emsp;&emsp;G2 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;----------->| <br/>
```typescript
    //以3个位一组，每组之休息10秒
    const res=await AsyncTasks.chunkTask(tasks,3,1000)
```