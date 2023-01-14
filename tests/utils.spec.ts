
import {describe, expect, test} from '@jest/globals';
// import { waterfallList,all,allSettle } from '../src/sky-promise';
import * as SkyUtils from '../src/utils';





  

describe('chunk method',()=>{
    test('chunk method work if chunk size >= arr.length',()=>{
        const arr=[1,2,3,4,5,6,7,8,9,10];
        const res=SkyUtils.chunk(arr,11);
        expect(res).toEqual([[1,2,3,4,5,6,7,8,9,10]]);
        expect(arr).toEqual([1,2,3,4,5,6,7,8,9,10]);
    })

    test('chunk method work',()=>{
        const arr=[1,2,3,4,5,6,7,8,9,10];
        const res=SkyUtils.chunk(arr,3);
        expect(res).toEqual([[1,2,3],[4,5,6],[7,8,9],[10]]);
        expect(arr).toEqual([1,2,3,4,5,6,7,8,9,10]);
    })
})

describe('flat method',()=>{
    test('flat method work',()=>{
        const arr1=[[1,2,3],[4,5,6],[7,8,9],[10]]
        const arr2=[[1,[2,3]],[4,5,[6]],[7,8,9],[[10]]]
        const expectedArr=[1,2,3,4,5,6,7,8,9,10];
        const res1=SkyUtils.flat(arr1);
        const res2=SkyUtils.flat(arr2);
        expect(res1).toEqual(expectedArr);
        expect(res2).toEqual(expectedArr);
    })
})

