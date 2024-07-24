import { timeThresholdConflictMsgPush } from '@/api/public'
let Socket = ''
let setIntervalWebsocketPush = null
let readyState = null
let protocol = window.location.protocol
let herf = window.location.origin
export const createSocket = (token) => {
    if (!Socket) {
        Socket && Socket.close()
        let _protocol = protocol === 'http:' ? 'ws://' : 'wss://'
        let wsUrl = process.env.NODE_ENV === 'development' ? 'ws://v5.sndtest.com/websocket' : `${_protocol + herf.split('//')[1]}/websocket`
        Socket = new WebSocket(wsUrl)
        readyState = Socket.readyState
        Socket.onopen = onopenWS(token)
        Socket.onmessage = onmessageWS
        Socket.onerror = onerrorWS
        Socket.onclose = oncloseWS
    } else {
    }
}

const onopenWS = (token) => {
    sendWSPush({
        'eventType': 1,
        'token': token !== undefined ? token : sessionStorage.getItem('token')
    })
    sendWSPush({
        'eventType': 2,
        'msgType': 5,
        'token': token !== undefined ? token : sessionStorage.getItem('token')
    })
    sendPing()
}
const onerrorWS = () => {
    Socket.close()
    clearInterval(setIntervalWebsocketPush)
    if (readyState !== 3) {
        Socket = null
        setTimeout(() => {
            createSocket()
        }, 5000)
    }
}

const onmessageWS = e => {
    if (e.data === 'PONG') return
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e.data
        }
    }))
}

const connecting = message => {
    setTimeout(() => {
        if (Socket.readyState === 0) {
            connecting(message)
        } else {
            Socket.send(JSON.stringify(message))
        }
    }, 1000)
}
export const MsgPush = e => {
    let params = {}
    timeThresholdConflictMsgPush(params).then(res => {
    })
}
export const sendWSPush = message => {
    if (Socket !== null && Socket.readyState === 3) {
        Socket.close()
    } else if (Socket.readyState === 1) {
        Socket.send(JSON.stringify(message))
    } else if (Socket.readyState === 0) {
        connecting(message)
    }
}

export const oncloseWS = () => {
    clearInterval(setIntervalWebsocketPush)
    if (Socket !== null && Socket.readyState !== 2) {
        Socket = null
        setTimeout(() => {
            createSocket()
        }, 5000)
    }
}

export const sendPing = (time = 15000) => {
    clearInterval(setIntervalWebsocketPush)
    setIntervalWebsocketPush = setInterval(() => {
        Socket.send('PING')
    }, time)
}

export const wsClose = () => {
    Socket.onclose = () => {
    }
    Socket.close()
    Socket = ''
    clearInterval(setIntervalWebsocketPush)
}
