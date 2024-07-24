
export const arr = [
    { time: '00:10' },
    { time: '00:20' },
    { time: '01:10' },
    { time: '01:11' },
    { time: '02:11' },
    { time: '02:13' },
    { time: '03:11' },
    { time: '03:15' },
    { time: '04:11' },
    { time: '04:13' },
    { time: '06:11' },
    { time: '06:18' },
    { time: '07:18' },
    { time: '07:58' },
    { time: '08:18' },
    { time: '08:38' },
    { time: '09:18' },
    { time: '10:18' },
    { time: '10:28' },
    { time: '11:18' },
    { time: '12:18' },
    { time: '12:28' },
    { time: '13:18' },
    { time: '13:48' },
    { time: '14:18' },
    { time: '15:18' },
    { time: '15:48' },
    { time: '16:18' },
    { time: '16:28' },
    { time: '17:18' },
    { time: '17:48' },
    { time: '18:18' },
    { time: '18:28' },
    { time: '19:18' },
    { time: '20:18' },
    { time: '21:18' },
    { time: '21:28' },
    { time: '22:12' },
    { time: '05:13' },
    { time: '05:20' },
    { time: '05:50' },
    { time: '23:10' },
    { time: '19:10' },
    { time: '14:10' },
    { time: '05:10' },
    { time: '05:55' },
    { time: '09:10' },
    { time: '11:10' },
    { time: '01:10' },
    { time: '03:10' },
    { time: '01:15' },
    { time: '07:10' },
    { time: '07:22' },
    { time: '07:13' },
    { time: '07:18' },
    { time: '07:42' },
    { time: '22:10' },
    { time: '21:55' },
    { time: '23:15' },
    { time: '19:10' },
    { time: '09:10' },
    { time: '20:10' },
    { time: '01:10' },
    { time: '12:10' },
    { time: '06:10' },
    { time: '15:11' },
    { time: '23:20' },
    { time: '02:10' },
    { time: '13:10' }
]
export const getCurrentMonth = (curMonth) => {
    let curDate = new Date();
    curDate.setMonth(curMonth);
    curDate.setDate(0);
    return curDate.getDate();
}
// 获取月份所有日期
export const getMonthDay = (day, month) => {
    // day为该月的天数
    let dayArr = []
    let newMonth = month
    if (newMonth >= 1 && newMonth <= 9) {
        newMonth = '0' + newMonth;
    }
    for (let k = 1; k <= day; k++) {
        // 对日期进行处理，1-9号在前面添加一个“0”
        if (k >= 0 && k <= 9) {
            k = '0' + k;
        }
        dayArr.push(`${newMonth}-${k}`)
    }
    return dayArr
}
// 冒泡
const bubblingFunc = (arrTime = []) => {
    for (let i = 0; i < arrTime.length - 1; i++) {
        for (let j = 0; j < arrTime.length - 1; j++) {
            if (arrTime[j] > arrTime[j + 1]) {
                let temp = arrTime[j];
                arrTime[j] = arrTime[j + 1];
                arrTime[j + 1] = temp;
            }
        }
    }
    return arrTime
}

export const lengthBubFuc = (arr = []) => {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j].length < arr[j + 1].length) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr
}
// 属性冒泡attribute
export const attributeBubFuc = (arr = []) => {
    if (arr.length < 2) return
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j].numHour > arr[j + 1].numHour) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr
}
// 过滤
export const filterFunc = (arr = []) => {
    let arrData = arr.filter(v => v.length < 3)
    return arrData
}
const arrFnc = (arr = []) => {
    let arrData = arr.length > 0 && arr.filter((v, i) => i > 0 && v - arr[0] >= 120)
    return arrData
}
const recursionFunc = (arr = []) => {
    let emptyArr = []
    const recursion = (arr = []) => {
        if (Array.isArray(arr) && arr.length > 1) {
            let arrs = arrFnc(arr)
            emptyArr.push(arrs[0])
            if (Array.isArray(arrs) && arrs.length > 1) {
                return recursion(arrs)
            } else {
                return emptyArr.filter(v => v)
            }
        }
    }
    let arrdats = arr.length > 0 && recursion(arr)
    let reterunData = arr.length > 0 && [arr[0]].concat(arrdats)
    return reterunData
}
const getMax = (arr = []) => {
    // console.log(arr, 'maxLength');
    let maxLength = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > maxLength) {
            maxLength = arr[i].length
        }
    }
    return maxLength
}
export const checkIsPointer = (arr = []) => {
    let isCheck = true
    let filterDatas = arr.map(item => item.numdiffer)
    let popArr = bubblingFunc(filterDatas)
    for (let i = 0; i < popArr.length; i++) {
        if (popArr[i + 1] && ((popArr[i + 1] - popArr[i] < 120))) {
            isCheck = false
        } else if (!popArr[i + 1]) {
            if (popArr[i] - popArr[i - 1] < 120) {
                isCheck = false
            }
        }
    }
    return isCheck
}
export const processsData = (arr = []) => {
    let arrDataArr = arr.map(v => ({ ...v, numHour: +v.time.split(':')[0], numMinite: +v.time.split(':')[1], numdiffer: (+v.time.split(':')[0] * 60) + (+v.time.split(':')[1]), numId: v.time.split(':')[0] + '.' + v.time.split(':')[1] }))
    return arrDataArr
}
// 左右间距
export const mLandMrFuc = (arr = []) => {
    let arrList = arr.map(v => ({ ...v, marginL: '', marginR: '' }))
    if (arrList.length === 1) {
        arrList[0].marginL = (arrList[0].numHour * 170 + arrList[0].numMinite * (17 / 6).toFixed(3)).toFixed(0)
        arrList[0].marginR = 0
    } else if (arrList.length === 2) {
        arrList.forEach((v, i) => {
            v.marginR = 0
            if (i === 0) {
                v.marginL = (v.numHour * 170 + v.numMinite * (17 / 6).toFixed(3)).toFixed(0)
            } else if (i === 1) {
                v.marginL = ((v.numHour * 170 + v.numMinite * (17 / 6).toFixed(3)) - (arrList[0].numHour * 170 + arrList[0].numMinite * (17 / 6).toFixed(1)) - 302).toFixed(0)
            }
        })
    } else {
        arrList.forEach((v, i) => {
            if (i === 0) {
                v.marginL = (v.numHour * 170 + v.numMinite * (17 / 6).toFixed(3)).toFixed(0)
                v.marginR = ((arrList[i + 1].numHour * 170 + arrList[i + 1].numMinite * (17 / 6).toFixed(3)) - (v.numHour * 170 + v.numMinite * (17 / 6).toFixed(3)) - 302).toFixed(0)
            } else if (i > 0 && i < arrList.length - 1) {
                v.marginR = ((arrList[i + 1].numHour * 170 + arrList[i + 1].numMinite * (17 / 6).toFixed(3)) - (v.numHour * 170 + v.numMinite * (17 / 6).toFixed(3)) - 302).toFixed(0)
            }
        })
    }

    return arrList
}
export const filtereveryData = (arrs = []) => {
    let arrTime = Array.from(new Set(arrs.map(item => +item.time.split(':')[0])))
    let objTime = []
    arrTime.forEach((v, i) => {
        objTime[i] = arrs.filter(item => item.numHour === v)
    })
    const maxLength = getMax(objTime)
    let everyRow = []
    for (let i = 0; i < maxLength; i++) {
        everyRow[i] = []
    }
    everyRow.forEach((v, i) => {
        objTime.forEach((val) => {
            everyRow[i].push(val[i] ? val[i] : {})
        })
    })
    let newEveryRow = everyRow.map(item => item.filter(v => Object.keys(v).length > 0))
    return newEveryRow
}
export const filterFuncOne = (arrs = []) => {
    let arrTime = Array.from(new Set(arrs.map(item => item.numdiffer)))
    let newTime = bubblingFunc(arrTime)
    let oneRow = recursionFunc(newTime)
    let firstArrs = arrs.filter(v => oneRow.includes(v.numdiffer))
    let secondArrs = arrs.filter(v => !oneRow.includes(v.numdiffer))
    return [firstArrs, secondArrs]
}
export const returnCheck = (arr = []) => {
    let twoArr = []
    let index = 0
    const recursionTwo = (arr = []) => {
        let threeArr = []
        let fourArr = []

        arr.forEach((v, i) => {
            threeArr[i] = filterFuncOne(arr)
        })

        fourArr = threeArr[0]
        twoArr[index] = []
        twoArr[index].push(...fourArr[0])
        index++
        if (!checkIsPointer(fourArr[1]) && fourArr[1].length > 1) {
            return recursionTwo(fourArr[1])
        } else {
            twoArr[index + 1] = []
            twoArr[index + 1].push(fourArr[1])
            return twoArr.filter(v => v)
        }
    }
    let reArr = arr.length > 0 && recursionTwo(arr)

    return reArr.filter(v => v.flat(2).length > 0)
}
export const multiarrArr = (arr = []) => {
    let a = 1
    const multiarr = (arr = []) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] instanceof Array) {
                a++;
                arr = arr[i];
                return	multiarr(arr);
            }
        }
        return a;
    }
    let num = arr.length && multiarr(arr)
    return num
}
export const haveFucPop = (arr = [], arr2 = []) => {
    let indexZero = []
    let idxNoZero = []
    arr.forEach((v, i) => {
        indexZero.push(v.filter((val, idx) => idx === 0))
        idxNoZero.push(v.filter((val, idx) => idx !== 0))
    })
    let filterNoZero = idxNoZero.filter(v => v.length).flat(Infinity).concat(arr2.flat(Infinity))
    let filterZero = indexZero.flat(1)
    let filterNoOne = filtereveryData(filterNoZero)
    return [filterZero, filterNoOne]
}
export const dhcekTwoLen = (arr = []) => {
    let arrs = []

    arr.forEach((v, i) => {
        if ((Math.abs(arr[1].numdiffer - arr[0].numdiffer) < 120)) {
            arrs[0] = [arr[0]]
            arrs[1] = [arr[1]]
        } else {
            arrs = arr
        }
    })
    return arrs
}
export const allArrFunc = (arr = []) => {
    let returnArrs = []
    const popsArr = (arr = []) => {
        let filteData = filtereveryData(arr)
        let moreLen = filteData.filter(v => v.length > 2)
        let oneLen = filterFunc(filteData)
        let retuArr = []
        if (moreLen.length > 0) {
            moreLen.forEach((v, i) => {
                retuArr[i] = returnCheck(v)
            })
        }
        let filterNoOne = haveFucPop(retuArr, oneLen)
        returnArrs.push(filterNoOne[0])
        // console.log(filterNoOne[1].flat(Infinity), checkIsPointer(filterNoOne[1].flat(Infinity)), 'filterNoOne[1].flat(Infinity)');
        if (filterNoOne[1].flat(Infinity).length > 0 && !checkIsPointer(filterNoOne[1].flat(Infinity)) && filterNoOne[1][0].length > 2) {
            return popsArr(filterNoOne[1].flat(Infinity))
        } else {
            returnArrs.push(filterNoOne[1])
            return returnArrs
        }
    }
    let finallyArr = arr.length && popsArr(arr).flat(1)
    let othersArr = finallyArr.filter(v => v.length !== 2)
    let tewolen = finallyArr.filter(v => v.length === 2)
    let sencondeLens = []
    let thiirdLens = []
    tewolen.forEach((v, i) => {
        let len1 = dhcekTwoLen(v)
        if (Array.isArray(len1[0])) {
            sencondeLens.push(len1)
        } else {
            thiirdLens.push(len1)
        }
    })
    let fourthLens = []
    let counts = 0
    sencondeLens.forEach(v => {
        if (v.length === 2) {
            counts = 1
        }
    })
    if (counts === 1) {
        fourthLens = sencondeLens.flat(1)
    } else {
        fourthLens = sencondeLens
    }
    let finanaly = othersArr.concat(fourthLens, thiirdLens)
    // console.log(finanaly, 'finallyArr');
    // let onemoreLen = finanaly.filter((v, i) => i > 0).flat(Infinity)
    // console.log(finanaly.filter((v, i) => i > 0), 'onemoreLen');
    // let oneFiltArr = onemoreLen.length && popsArr(onemoreLen).flat(1)
    // console.log(oneFiltArr, 'oneFiltArr');
    return finanaly
}
