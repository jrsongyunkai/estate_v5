export const timeSeason = () => {
    return [
        { value: [0, 1, 2], startTime: `${new Date().getFullYear()}-01-01`, endTime: `${new Date().getFullYear()}-03-31` },
        { value: [3, 4, 5], startTime: `${new Date().getFullYear()}-04-01`, endTime: `${new Date().getFullYear()}-06-30` },
        { value: [6, 7, 8], startTime: `${new Date().getFullYear()}-07-01`, endTime: `${new Date().getFullYear()}-09-30` },
        { value: [9, 10, 11], startTime: `${new Date().getFullYear()}-10-01`, endTime: `${new Date().getFullYear()}-12-31` },
    ]
}
export const timeMonths = () => {
    let flagRun = isRunYear(new Date().getFullYear())
    return [
        { value: 0, startTime: `${new Date().getFullYear()}-01-01~${new Date().getFullYear()}-01-31` },
        { value: 1, startTime: `${new Date().getFullYear()}-02-01~${new Date().getFullYear()}-02-${flagRun ? '29' : '28'}` },
        { value: 2, startTime: `${new Date().getFullYear()}-03-01~${new Date().getFullYear()}-03-31` },
        { value: 3, startTime: `${new Date().getFullYear()}-04-01~${new Date().getFullYear()}-04-30` },
        { value: 4, startTime: `${new Date().getFullYear()}-05-01~${new Date().getFullYear()}-05-31` },
        { value: 5, startTime: `${new Date().getFullYear()}-06-01~${new Date().getFullYear()}-06-30` },
        { value: 6, startTime: `${new Date().getFullYear()}-07-01~${new Date().getFullYear()}-07-31` },
        { value: 7, startTime: `${new Date().getFullYear()}-08-01~${new Date().getFullYear()}-08-31` },
        { value: 8, startTime: `${new Date().getFullYear()}-09-01~${new Date().getFullYear()}-09-30` },
        { value: 9, startTime: `${new Date().getFullYear()}-10-01~${new Date().getFullYear()}-10-31` },
        { value: 10, startTime: `${new Date().getFullYear()}-11-01~${new Date().getFullYear()}-11-30` },
        { value: 11, startTime: `${new Date().getFullYear()}-12-01~${new Date().getFullYear()}-12-31` }
    ]
}
const isRunYear = (year) => {
    var flag = false;
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        flag = true;
    }
    return flag;
}
