import axios from 'axios'
import { Howl, Howler } from 'howler'
import qs from 'qs'

export class AsyncTaskQueen {
  _queue = []
  _isProcessing = false

  add(task) {
    this._queue.push(task)
    this.process()
  }

  process() {
    if (this._isProcessing) return
    this._process()
  }

  async _process() {
    if (this._queue.length === 0) {
      this._isProcessing = false
      return
    }
    this._isProcessing = true
    const task = this._queue.shift()
    const { run, onSuccess, onError } = typeof task === 'function' ? { run: task } : task
    try {
      const result = await run()
      onSuccess && onSuccess(result)
    } catch (e) {
      onError && onError(e)
    }
    this._process()
  }

  dispose() {
    this._queue = []
    this._isProcessing = false
  }
}

export class AlarmPlayer {
  _playlist = new AsyncTaskQueen()

  add(ringCfg, text) {
    // const soundSrcPromise = textToSpeech(text)
    this._playlist.add(async () => {
      const tasks = []

      if (ringCfg) {
        tasks.push(playSound(ringCfg.soundSrc, ringCfg.loop))
      }
      if (text) {
        // tasks.push(
        //   (async () => {
        //     const soundSrc = await soundSrcPromise
        //     // eslint-disable-next-line no-throw-literal
        //     if (!soundSrc) throw '语音合成失败'
        //     return playSound(soundSrc)
        //   })()
        // )
        tasks.push(playTTSBuiltin(text))
      }
      return Promise.allSettled(tasks)
    })
  }

  clear() {
    this._playlist.dispose()
    Howler.unload()
    speechSynthesis.cancel()
  }
}

export const playSound = (soundSrc, loop = 1) => {
  let count = 0

  return new Promise((resolve, reject) => {
    const sound = new Howl({
      src: [soundSrc],
      html5: true,
      loop: true,
      autoplay: true,
      onend: () => {
        count++
        console.log('🚀 ~ play times ~ count:', count)
        if (count >= loop - 1) {
          setTimeout(() => {
            sound.loop(false)
            sound.off('end')
            sound.off('stop')
            sound.off('loaderror')
            sound.off('playerror')
            sound.unload()
            resolve()
          }, 0)
        }
      },
      onstop: () => {
        console.log('stop')
      },
      onloaderror(id, msg) {
        // 加载失败，跳过
        reject(msg)
      },
      onplayerror() {
        sound.once('unlock', () => {
          sound && sound.play()
        })
      },
    })
  })
}

export const textToSpeech = async text => {
  if (!text) return ''
  try {
    const res = await axios.post(
      'http://test.yqniu.com/language/textToSpeech',
      qs.stringify({
        code: '100',
        text,
        messageId: Date.now(),
      }),
      {
        timeout: 10000,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJhcHBJZCI6IjE0MTMyNzczNjYifQ.K9e6aO2Bienvxxjvne_aRokHU2sQUB_nfY87qj5UDnc',
        },
      }
    )
    if (res.data && res.data.code === 0) {
      return res.data.data
    }
    return ''
  } catch (e) {
    return ''
  }
}

export const playTTSBuiltin = text =>
  new Promise(resolve => {
    if (!text) return resolve()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.onend = resolve
    speechSynthesis.speak(utterance)
  })
