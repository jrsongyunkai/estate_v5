export const processDeviceLineToObj = (data) => {
    return Array.isArray(data) ? data.reduce((pre, cur) => {
        pre[cur.mac] = {
            ...cur,
            checked: false,
            indeter: false,
            isAllNot808: Array.isArray(cur.addrs) && (!!cur.addrs.length || !!((cur.addrs.filter(v => v.lineType !== 'IO')).length === cur.addrs.length)),
            is808: Array.isArray(cur.addrs) && !!(cur.addrs.filter(v => v.lineType === 'IO')).length,
            isAll808: Array.isArray(cur.addrs) && !!cur.addrs.length && !!((cur.addrs.filter(v => v.lineType === 'IO')).length === cur.addrs.length),
            addrs: Array.isArray(cur.addrs) && cur.addrs.length ? cur.addrs.map(v => ({ ...v, is808: v.lineType === 'IO', mac: cur.mac, checked: false })) : []
        }
        return pre
    }, {}) : {}
}

export const processDeviceLineToArray = (data) => {
    return Array.isArray(data) ? data.map((cur) => {
        return {
            ...cur,
            checked: false,
            indeter: false,
            name: `${cur.name}(${cur.mac})`,
            isAllNot808: Array.isArray(cur.addrs) && (!!cur.addrs.length || !!((cur.addrs.filter(v => v.lineType !== 'IO')).length === cur.addrs.length)),
            is808: Array.isArray(cur.addrs) && !!cur.addrs.length && !!(cur.addrs.filter(v => v.lineType === 'IO')).length,
            isAll808: Array.isArray(cur.addrs) && !!cur.addrs.length && !!((cur.addrs.filter(v => v.lineType === 'IO')).length === cur.addrs.length),
            addrs: Array.isArray(cur.addrs) && cur.addrs.length ? cur.addrs.map(v => {
                return {
                    ...v,
                    mac: cur.mac,
                    is808: v.lineType === 'IO',
                    checked: false,
                    macAddr: cur.mac + v.addr,
                    digitalOuts: Array.isArray(v.digitalOuts) && v.digitalOuts.length ? v.digitalOuts.map(item => ({ ...item, mac: cur.mac, addr: v.addr, macAddr: cur.mac + v.addr, checked: false })) : []
                }
            }) : []
        }
    }) : []
}

export const processDeviceLineToObj808 = (data) => {
    return Array.isArray(data) ? data.reduce((pre, cur) => {
        pre[cur.mac] = {
            ...cur,
            checked: false,
            indeter: false,
            isAllNot808: Array.isArray(cur.addrs) && (!cur.addrs.length || !!((cur.addrs.filter(v => v.lineType !== 'IO')).length === cur.addrs.length)),
            addrs: Array.isArray(cur.addrs) && cur.addrs.length ? cur.addrs.map(v => ({ ...v, mac: cur.mac, is808: v.lineType === 'IO', checked: false })) : []
        }
        pre[cur.mac].addrs.forEach(v => {
            pre[v.mac + v.addr] = {
                ...v,
                macAddr: v.mac + v.addr,
                is808: v.lineType === 'IO',
                digitalOuts: Array.isArray(v.digitalOuts) && v.digitalOuts.length ? v.digitalOuts.map(item => ({ ...item, mac: cur.mac, addr: v.addr, macAddr: v.mac + v.addr, checked: false })) : []
            }
        })

        return pre
    }, {}) : {}
}

export const processDeviceLineToArray808 = (data) => {
    return Array.isArray(data) ? data.map((cur) => {
        return {
            ...cur,
            checked: false,
            indeter: false,
            name: `${cur.name}(${cur.mac})`,
            is808: Array.isArray(cur.addrs) && !!cur.addrs.length && !!(cur.addrs.filter(v => v.lineType === 'IO')).length,
            isAllNot808: Array.isArray(cur.addrs) && (!cur.addrs.length || !!((cur.addrs.filter(v => v.lineType !== 'IO')).length === cur.addrs.length)),
            addrs: Array.isArray(cur.addrs) && cur.addrs.length ? cur.addrs.map(v => {
                return {
                    ...v,
                    mac: cur.mac,
                    is808: v.lineType === 'IO',
                    checked: false,
                    macAddr: cur.mac + v.addr,
                    digitalOuts: Array.isArray(v.digitalOuts) && v.digitalOuts.length ? v.digitalOuts.map(item => ({ ...item, mac: cur.mac, addr: v.addr, macAddr: cur.mac + v.addr, checked: false })) : []
                }
            }) : []
        }
    }) : []
}

export const getDeviceIndeterminate = (data) => {
    if (data.length === 0) return false

    let count = 0;
    let checkedCount = 0;
    data.forEach(v => {
        count++;
        if (v.checked) {
            checkedCount++
        }
        Array.isArray(v.digitalOuts) && v.digitalOuts.length && v.digitalOuts.forEach(item => {
            count++;
            if (item.checked) {
                checkedCount++
            }
        })
    })
    if (checkedCount === 0) return false
    return count !== checkedCount
}
