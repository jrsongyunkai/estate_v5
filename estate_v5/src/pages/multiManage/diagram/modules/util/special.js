/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable one-var */
function X2(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect
  const a = n / 2 <= o / 6 ? n / 2 : o / 6,
    s = a / 2
  const l = r + o - a - Math.cos(Math.asin(0.5)) * a,
    c = e.max || 20,
    u = e.min || -20
  return (
    G2(t, i, r, o, a, s, n, {
      strokeStyle: e.textColor || '#4583FF',
      min: e.min,
      max: e.max,
      fontSize: e.calculative.fontSize,
    }),
    J2(t, i, r, l, o, a, s, {
      strokeStyle: e.color,
      fillStyle: e.background,
    }),
    t.beginPath(),
    Q2(t, i, r, l, o, a, s, {
      value: e.value,
      min: u,
      max: c,
      background: e.background || '#FF5D3C33',
      activeBackground: e.activeBackground || '#FF5D3C',
    }),
    t.closePath(),
    !1
  )
}
function G2(t, e, i, r, n, o, a, s) {
  const { min: l, max: c, strokeStyle: u, fontSize: h } = s
  ;(e += o + n), (i += o)
  const d = (r - n - o - (Math.sqrt(3) / 2) * n) / (c - l)
  ;(t.fillStyle = u || '#FFFFFFB3'), (t.font = h + 'px Arial'), (t.textBaseline = 'middle'), (t.textAlign = 'left')
  for (let f = c; f >= l; f--) t.beginPath(), t.moveTo(e, i), f % 10 == 0 ? ((t.lineWidth = 2), t.lineTo(e + o, i), t.fillText(f, e + o + h / 2, i)) : ((t.lineWidth = 1), f % 5 == 0 ? t.lineTo(e + (o * 2) / 3, i) : t.lineTo(e + o / 3, i)), (i += d), t.stroke()
}

function Q2(t, e, i, r, n, o, a, s) {
  const { background: l, activeBackground: c, value: u, min: h, max: d } = s
  const f = 0.3 * o,
    v = a - f,
    g = o - f,
    m = e + 3 * a - f,
    b = e + a + f
  if (
    (t.beginPath(),
    xr(
      t,
      {
        x: b,
        y: r,
        centerX: e + o,
        centerY: i + a,
        x1: m,
        y1: r,
        r: v,
      },
      {
        startAngle: Math.PI,
        direction: !1,
      }
    ),
    u < h)
  )
    Kt(
      t,
      {
        x: e + o,
        y: i + n - o,
        r: g,
      },
      {
        fillStyle: l,
        startAngle: (-1 / 3) * Math.PI,
        endAngle: (4 / 3) * Math.PI,
      }
    ),
      t.closePath(),
      t.beginPath()
  else if (u <= d) {
    const w = ((u - h) / (d - h)) * (r - i - a)
    ;(t.fillStyle = l), t.fill(), t.closePath(), t.beginPath(), t.moveTo(b, r), t.lineTo(b, r - w), t.lineTo(m, r - w), t.lineTo(m, r)
  }
  Kt(
    t,
    {
      x: e + o,
      y: i + n - o,
      r: g,
    },
    {
      fillStyle: c,
      startAngle: (-1 / 3) * Math.PI,
      endAngle: (4 / 3) * Math.PI,
    }
  ),
    t.closePath()
}
function J2(t, e, i, r, n, o, a, s) {
  const { strokeStyle: l } = s
  t.beginPath(),
    xr(
      t,
      {
        x: e + a,
        y: r,
        centerX: e + o,
        centerY: i + a,
        x1: e + 3 * a,
        y1: r,
        r: a,
      },
      {
        strokeStyle: l,
        startAngle: Math.PI,
        direction: !1,
      }
    ),
    Kt(
      t,
      {
        x: e + o,
        y: i + n - o,
        r: o,
      },
      {
        strokeStyle: l,
        startAngle: (-1 / 3) * Math.PI,
        endAngle: (4 / 3) * Math.PI,
      }
    ),
    t.closePath()
}

function xr(t, e, i) {
  const { x: r, y: n, centerX: o, centerY: a, x1: s, y1: l, r: c } = e,
    { strokeStyle: u, startAngle: h = 0, endAngle: d = 2 * Math.PI, direction: f = !1, fillStyle: v, lineWidth: g = 1 } = i
  t.moveTo(r, n), t.arc(o, a, c, h, d, f), t.lineTo(s, l), (t.lineWidth = g), u && ((t.strokeStyle = u), t.stroke()), v && ((t.fillStyle = v), t.fill())
}
function Kt(t, e, i) {
  const { x: r, y: n, r: o } = e,
    { startAngle: a = 0, endAngle: s = 2 * Math.PI, strokeStyle: l, fillStyle: c } = i
  t.arc(r, n, o, a, s), l && ((t.strokeStyle = l), t.stroke()), c && ((t.fillStyle = c), t.fill())
}

function nC(t) {
  t.disable || ((t.checked = !t.checked), t.calculative.canvas.store.emitter.emit('valueUpdate', t), t.calculative.canvas.render())
}

function ri(t, e, i) {
  const { x: r, y: n, w: o, h: a } = e,
    { strokeStyle: s, fillStyle: l, lineWidth: c = 1 } = i
  ;(t.lineWidth = c), l && ((t.fillStyle = l), t.fillRect(r, n, o, a)), s && ((t.strokeStyle = s), t.strokeRect(r, n, o, a))
}

function iC(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect
  ;(e.checked = !0), isFinite(t.globalAlpha) && t.globalAlpha
  const a = e.checked ? e.onColor : e.color,
    s = e.checked ? e.onColor + '66' : e.background,
    l = (1 / 8) * n
  if (e.displayStatus === 0) {
    const c = 0.375 * n,
      u = r + o - l
    const h = {
      x: i + l,
      y: u,
      centerX: i + n / 2,
      centerY: r + c,
      r: c,
      x1: i + n - l,
      y1: u,
    }
    t.beginPath(),
      xr(t, h, {
        strokeStyle: a,
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
        fillStyle: s,
      }),
      t.closePath(),
      (h.x += l),
      (h.x1 -= l),
      (h.r -= l),
      t.beginPath(),
      xr(t, h, {
        strokeStyle: a,
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
        fillStyle: s,
      }),
      t.closePath(),
      ri(
        t,
        {
          x: i,
          y: u,
          w: n,
          h: l,
        },
        {
          strokeStyle: e.color,
          fillStyle: e.background,
        }
      )
  } else if (e.displayStatus === 1)
    ri(
      t,
      {
        x: i,
        y: r,
        w: n,
        h: o,
      },
      {
        strokeStyle: a,
        fillStyle: s,
      }
    ),
      ri(
        t,
        {
          x: i + l,
          y: r + l,
          w: n - 2 * l,
          h: o - 2 * l,
        },
        {
          strokeStyle: a,
          fillStyle: s,
        }
      )
  else if (e.displayStatus === 2) {
    const c = n > o ? o / 2 : n / 2
    Kt(
      t,
      {
        x: i + n / 2,
        y: r + o / 2,
        r: c,
      },
      {
        strokeStyle: a,
        fillStyle: s,
      }
    ),
      t.beginPath(),
      Kt(
        t,
        {
          x: i + n / 2,
          y: r + o / 2,
          r: c - l,
        },
        {
          strokeStyle: a,
          fillStyle: s,
        }
      )
  }
  return !1
}
function rC(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect,
    a = n / o > 0.5 ? o / 8 : n / 4,
    s = e.color,
    l = e.background,
    c = e.checked ? '#00FF00' : '#FF0000',
    u = e.checked ? '#00FF00' + '66' : '#FF0000' + '66',
    h = 0.3 * n,
    d = 0.1 * o

  e.onClick || (e.onClick = nC),
    ri(
      t,
      {
        x: i,
        y: r,
        w: n,
        h: (13 / 16) * o,
      },
      {
        strokeStyle: s,
        fillStyle: l,
      }
    ),
    ri(
      t,
      {
        x: i + h,
        y: r + d,
        w: n - 2 * h,
        h: (13 / 16) * o - d * 3,
      },
      {
        strokeStyle: s,
      }
    ),
    t.clearRect(i + h, r + d, n - 2 * h, (13 / 16) * o - d * 3)
  const f = {
    x: i + (n * 8) / 18,
    y: e.checked ? r + o / 32 : r + (o * 25) / 64,
    w: n / 9,
    h: (o * 23) / 64,
  }
  return (
    ri(t, f, {
      strokeStyle: s,
      fillStyle: l,
    }),
    Kt(
      t,
      {
        x: i + n / 2,
        y: e.checked ? f.y - a : f.y + f.h + a,
        r: a,
      },
      {
        strokeStyle: c,
        fillStyle: u,
      }
    ),
    !1
  )
}

function sC(t) {
  t.disable || ((t.checked = !t.checked), t.calculative.canvas.store.emitter.emit('valueUpdate', t), t.calculative.canvas.render())
}

function oC(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect
  let a = o
  if (
    (e.onClick || (e.onClick = sC),
    o > n && (a = n),
    (a = (a * 3) / 2),
    t.beginPath(),
    aC(t, e, i + n / 2, r + o / 2, 6, a / 4),
    t.closePath(),
    t.beginPath(),
    Kt(
      t,
      {
        x: i + n / 2,
        y: r + o / 2,
        r: a / 8,
      },
      {
        strokeStyle: e.color,
      }
    ),
    t.closePath(),
    t.beginPath(),
    e.checked)
  ) {
    const s = e.onColor + '66' || '#58CC8466',
      l = e.onColor || '#58CC84',
      c = {
        x: i + n / 2 + a / 12,
        y: r + o / 2 - a / 4 + a / 10.5,
        centerX: i + n / 2,
        centerY: r + o / 2,
        x1: i + n / 2 - a / 12,
        y1: r + o / 2 - a / 4 + a / 10.5,
        r: a / 12,
      }
    xr(t, c, {
      startAngle: 0,
      endAngle: Math.PI,
      strokeStyle: l,
    }),
      t.moveTo(i + n / 2 + a / 8, r + o / 2 - a / 4),
      Kt(
        t,
        {
          x: i + n / 2,
          y: r + o / 2 - a / 4,
          r: a / 8,
        },
        {
          fillStyle: s,
          strokeStyle: l,
        }
      )
  } else {
    const s = e.offColor + '66' || '#FF5D3C66',
      l = e.offColor || '#FF5D3C',
      c = {
        x: i + n / 2 - a / 12,
        y: r + o / 2 + a / 4 - a / 10.5,
        centerX: i + n / 2,
        centerY: r + o / 2,
        x1: i + n / 2 + a / 12,
        y1: r + o / 2 + a / 4 - a / 10.5,
        r: a / 12,
      }
    xr(t, c, {
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      strokeStyle: l,
    }),
      t.moveTo(i + n / 2 + a / 8, r + o / 2 + a / 4),
      Kt(
        t,
        {
          x: i + n / 2,
          y: r + o / 2 + a / 4,
          r: a / 8,
        },
        {
          fillStyle: s,
          strokeStyle: l,
        }
      )
  }
  return !1
}

function aC(t, e, i, r, n, o) {
  let a, s
  for (s = (Math.PI * 2) / n, t.save(), t.fillStyle = e.background, t.strokeStyle = e.color, t.lineWidth = 1, t.translate(i, r), t.moveTo(-o, 0), t.beginPath(), a = 0; a < n; a++) t.rotate(s), t.lineTo(-o, 0)
  t.closePath(), t.stroke(), t.fill(), t.restore()
}

function Y2({ fontStyle: t = 'normal', textDecoration: e = 'normal', fontWeight: i = 'normal', fontSize: r = 12, fontFamily: n = 'Arial', lineHeight: o = 1 } = {}) {
  return `${t} ${e} ${i} ${r}px/${o} ${n}`
}

function ad(t, e, i, r, n) {
  n && (t.font = Y2(n))
  const { x: o, y: a } = i
  for (const [s, l] of Object.entries(r)) t[s] = l
  t.fillText(e, o, a)
}

function AC(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect
  const { fontStyle: a, fontWeight: s, fontSize: l, fontFamily: c, lineHeight: u } = e.calculative
  const { value: h = 0, max: d = 20, min: f = -20 } = e,
    v = n / 6,
    { background: g = '#FF5D3C33', activeBacground: m = '#FF5D3C' } = e
  let b
  h < f ? (b = 1) : h > d ? (b = 0) : (b = (d - h) / (d - f))
  const w = (85 / 128) * o,
    p = r + (31 / 128) * o
  return (
    ri(
      t,
      {
        x: i,
        y: r,
        w: n,
        h: o,
      },
      {
        strokeStyle: e.color || '#4583FF',
      }
    ),
    ad(
      t,
      '\u2103',
      {
        x: i + v,
        y: r + o / 15,
      },
      {
        fillStyle: e.textColor || '#FFFFFFB6',
        textAlign: 'center',
        textBaseline: 'top',
      },
      {
        fontStyle: a,
        fontWeight: s,
        fontSize: l,
        fontFamily: c,
        lineHeight: u,
      }
    ),
    ri(
      t,
      {
        x: i + v,
        y: r + (31 / 128) * o,
        w: n / 6,
        h: w * b,
      },
      {
        fillStyle: g,
      }
    ),
    ri(
      t,
      {
        x: i + v,
        y: p + w * b,
        w: n / 6,
        h: w * (1 - b),
      },
      {
        fillStyle: m,
      }
    ),
    PC(
      t,
      w,
      i + 2 * v,
      p,
      v,
      {
        max: d,
        min: f,
        fillStyle: e.textColor || '#FFFFFFB6',
        textAlign: 'left',
        textBaseline: 'middle',
      },
      {
        fontStyle: a,
        fontWeight: s,
        fontSize: l / 2,
        fontFamily: c,
        lineHeight: u,
      }
    ),
    !1
  )
}

function PC(t, e, i, r, n, o, a) {
  const { max: s, min: l, fillStyle: c, textAlign: u, textBaseline: h } = o
  const { fontSize: d } = a,
    f = e / (s - l)
  for (let v = s; v >= l; v--)
    t.beginPath(),
      t.moveTo(i, r),
      v % 10 == 0
        ? ((t.lineWidth = 2),
          t.lineTo(i + n, r),
          ad(
            t,
            v,
            {
              x: i + n + d,
              y: r,
            },
            {
              fillStyle: c,
              textAlign: u,
              textBaseline: h,
            },
            a
          ))
        : ((t.lineWidth = 1), v % 5 == 0 ? t.lineTo(i + n * 0.75, r) : t.lineTo(i + n * 0.5, r)),
      t.stroke(),
      t.closePath(),
      (r += f)
}

function _C(t) {
  ;(t.switch = !t.switch), t.calculative.canvas.store.emitter.emit('valueUpdate', t), t.calculative.canvas.render()
}

function TC(t, e) {
  e.onClick || (e.onClick = _C)
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect
  return (
    t.beginPath(),
    t.moveTo(i + (10 / 180) * n, r),
    (t.strokeStyle = e.color),
    (t.lineWidth = 1),
    t.lineTo(i + ((10 + 160) / 180) * n, r),
    t.lineTo(i + ((10 + 160) / 180) * n, r + (55 / 240) * o),
    t.lineTo(i + (10 / 180) * n, r + (55 / 240) * o),
    t.lineTo(i + (10 / 180) * n, r),
    t.closePath(),
    (t.fillStyle = e.background),
    t.fill(),
    t.stroke(),
    t.beginPath(),
    t.moveTo(i + ((10 + 32) / 180) * n, r + (28 / 240) * o),
    t.arc(i + ((10 + 21) / 180) * n, r + (28 / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.moveTo(i + ((10 + 92) / 180) * n, r + (28 / 240) * o),
    t.arc(i + ((10 + 81) / 180) * n, r + (28 / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.moveTo(i + ((10 + 152) / 180) * n, r + (28 / 240) * o),
    t.arc(i + ((10 + 141) / 180) * n, r + (28 / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.stroke(),
    t.beginPath(),
    (t.lineWidth = 1),
    t.rect(i, r + (55 / 240) * o, (60 / 180) * n, (130 / 240) * o),
    t.closePath(),
    t.stroke(),
    t.fill(),
    t.beginPath(),
    (t.lineWidth = 1),
    t.rect(i + (60 / 180) * n, r + (55 / 240) * o, (60 / 180) * n, (130 / 240) * o),
    t.closePath(),
    t.stroke(),
    t.fill(),
    t.beginPath(),
    (t.lineWidth = 1),
    t.rect(i + (120 / 180) * n, r + (55 / 240) * o, (60 / 180) * n, (130 / 240) * o),
    t.closePath(),
    t.stroke(),
    t.fill(),
    t.beginPath(),
    t.moveTo(i + (10 / 180) * n, r + (185 / 240) * o),
    (t.strokeStyle = e.color),
    (t.lineWidth = 1),
    t.lineTo(i + ((10 + 160) / 180) * n, r + (185 / 240) * o),
    t.lineTo(i + ((10 + 160) / 180) * n, r + ((55 + 185) / 240) * o),
    t.lineTo(i + (10 / 180) * n, r + ((55 + 185) / 240) * o),
    t.lineTo(i + (10 / 180) * n, r + (185 / 240) * o),
    t.closePath(),
    (t.fillStyle = e.background),
    t.fill(),
    t.stroke(),
    t.beginPath(),
    t.moveTo(i + ((10 + 32) / 180) * n, r + ((28 + 185) / 240) * o),
    t.arc(i + ((10 + 21) / 180) * n, r + ((28 + 185) / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.moveTo(i + ((10 + 92) / 180) * n, r + ((28 + 185) / 240) * o),
    t.arc(i + ((10 + 81) / 180) * n, r + ((28 + 185) / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.moveTo(i + ((10 + 152) / 180) * n, r + ((28 + 185) / 240) * o),
    t.arc(i + ((10 + 141) / 180) * n, r + ((28 + 185) / 240) * o, (11 / 180) * n, 0, Math.PI * 2),
    t.closePath(),
    t.stroke(),
    e.switch
      ? (t.beginPath(),
        (t.strokeStyle = e.onColor || '#0AECA1'),
        (t.lineWidth = 1),
        t.rect(i, r + (120 / 240) * o, (180 / 180) * n, (12.5 / 240) * o),
        t.closePath(),
        t.stroke(),
        (t.fillStyle = e.onColor + '33' || '#0AECA173'),
        t.fill(),
        t.beginPath(),
        t.rect(i + (16 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (16 / 180) * n, r + ((120 + 12.5 + 10) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (76 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (76 / 180) * n, r + ((120 + 12.5 + 10) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (136 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (136 / 180) * n, r + ((120 + 12.5 + 10) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill())
      : (t.beginPath(),
        (t.strokeStyle = e.offColor || '#F53E6C'),
        (t.lineWidth = 1),
        t.rect(i, r + ((170 + 2.5) / 240) * o, (180 / 180) * n, (12.5 / 240) * o),
        t.closePath(),
        t.stroke(),
        (t.fillStyle = e.offColor + '33' || '#F53E6C73'),
        t.fill(),
        t.beginPath(),
        (t.lineWidth = 1),
        (t.strokeStyle = e.color),
        t.moveTo(i, r + ((120 + 12.5) / 240) * o),
        t.lineTo(i + (180 / 180) * n, r + ((120 + 12.5) / 240) * o),
        t.stroke(),
        t.closePath(),
        t.beginPath(),
        (t.lineWidth = 1),
        (t.strokeStyle = 'rgb(234,62,108)'),
        t.rect(i + (16 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (16 / 180) * n, r + ((120 + 12.5 + 30) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (76 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (76 / 180) * n, r + ((120 + 12.5 + 30) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (136 / 180) * n, r + ((120 + 12.5) / 240) * o, (28 / 180) * n, (30 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill(),
        t.beginPath(),
        t.rect(i + (136 / 180) * n, r + ((120 + 12.5 + 30) / 240) * o, (28 / 180) * n, (10 / 240) * o),
        t.closePath(),
        t.stroke(),
        t.fill()),
    !1
  )
}

function eC(t, e) {
  const i = e.calculative.worldRect.width,
    r = e.calculative.worldRect.height,
    n = i > r ? i : r,
    o = i > r ? r - 4 : i - 4
  let a
  i >= r ? (a = o) : (a = n)
  const s = 0.2,
    l = 1,
    c = Math.floor(Math.random() * 10),
    u = (e.value / 100) * o
  const v = Math.abs(u - o / 2)
  let h = 0,
    d = 0,
    f = 0
  u / (o / 2) >= 1
    ? ((h = e.calculative.worldRect.x + i / 2 - Math.sqrt((o / 2) * (o / 2) - v * v)), e.calculative.worldRect.y + r / 2 - v, (d = e.calculative.worldRect.x + i / 2 + Math.sqrt((o / 2) * (o / 2) - v * v)), (f = Math.asin(v / (o / 2))))
    : ((h = e.calculative.worldRect.x + i / 2 - Math.sqrt((o / 2) * (o / 2) - v * v)), e.calculative.worldRect.y + r / 2 + v, (d = e.calculative.worldRect.x + i / 2 + Math.sqrt((o / 2) * (o / 2) - v * v)), (f = -Math.asin(v / (o / 2)))),
    t.beginPath(),
    (t.fillStyle = e.background),
    e.value > e.max && (t.fillStyle = e.maxBackground || '#f5222d'),
    e.value < e.min && (t.fillStyle = e.minBackground || '#52c41a'),
    t.arc(e.calculative.worldRect.x + i / 2, e.calculative.worldRect.y + r / 2, o / 2, -f, Math.PI + f)
  for (let g = h; g < d; g += 20 / (d - h)) {
    const m = l * Math.sin((h + g) * s + c) + e.calculative.worldRect.y + o / 2 - u
    t.lineTo(g, a / 2 + m)
  }
  t.fill(), t.closePath()
}
function tC(t, e) {
  const i = e.calculative.worldRect.x,
    r = e.calculative.worldRect.y,
    n = e.calculative.worldRect.width,
    o = e.calculative.worldRect.height,
    a = n > o ? n : o,
    s = n > o ? o : n,
    l = Math.floor(s / 2),
    c = 7,
    u = s,
    h = e.max,
    d = e.min
  let f,
    v,
    g,
    m,
    b,
    w,
    p = 0
  e.maxText || (e.maxText = 'max'),
    e.minText || (e.minText = 'min'),
    d && (n > o ? ((f = Math.abs(r + ((100 - d) / 100) * u - (r + u / 2))), (v = Math.sqrt(Math.pow(l, 2) - Math.pow(f, 2))), (g = l - v + i + a / 2 - s / 2)) : ((f = Math.abs(r + ((100 - d) / 100) * u - (r + u / 2))), (v = Math.sqrt(Math.pow(l, 2) - Math.pow(f, 2))), (g = l - v + i))),
    h && (n > o ? ((m = Math.abs(r + ((100 - h) / 100) * u - (r + u / 2))), (b = Math.sqrt(Math.pow(l, 2) - Math.pow(m, 2))), (w = l - b + i + a / 2 - s / 2)) : ((m = Math.abs(r + ((100 - h) / 100) * u - (r + u / 2))), (b = Math.sqrt(Math.pow(l, 2) - Math.pow(m, 2))), (w = l - b + i))),
    t.beginPath(),
    (t.fillStyle = '#000')
  const C = s / 10
  ;(t.font = C + 'px Arial'),
    d && h
      ? g > w
        ? ((p = g - w),
          n >= o
            ? (t.moveTo(g, r + ((100 - d) / 100) * u),
              t.lineTo(g - c - p, r + ((100 - d) / 100) * u),
              (t.direction = 'rtl'),
              t.fillText(e.minText, g - c - p, r + ((100 - d) / 100) * u + 3),
              t.fillText(d, g - c - p, r + ((100 - d) / 100) * u + C),
              t.moveTo(w, r + ((100 - h) / 100) * u),
              t.lineTo(w - c, r + ((100 - h) / 100) * u),
              (t.direction = 'rtl'),
              t.fillText(e.maxText, w - c, r + ((100 - h) / 100) * u + 3),
              t.fillText(h, w - c, r + ((100 - h) / 100) * u + C))
            : (t.moveTo(g, r + ((100 - d) / 100) * u + a / 2 - s / 2),
              t.lineTo(g - c - p, r + ((100 - d) / 100) * u + a / 2 - s / 2),
              (t.direction = 'rtl'),
              t.fillText(e.minText, g - c - p, r + ((100 - d) / 100) * u + a / 2 - s / 2 + 3),
              t.fillText(d, g - c - p, r + ((100 - d) / 100) * u + a / 2 - s / 2 + C),
              t.moveTo(w, r + ((100 - h) / 100) * u + a / 2 - s / 2),
              t.lineTo(w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2),
              (t.direction = 'rtl'),
              t.fillText(e.maxText, w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2 + 3),
              t.fillText(h, w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2 + C)))
        : ((p = w - g),
          n >= o
            ? (t.moveTo(g, r + ((100 - d) / 100) * u),
              t.lineTo(g - c, r + ((100 - d) / 100) * u),
              (t.direction = 'rtl'),
              t.fillText(e.minText, g - c, r + ((100 - d) / 100) * u + 3),
              t.fillText(d, g - c, r + ((100 - d) / 100) * u + 15),
              t.moveTo(w, r + ((100 - h) / 100) * u),
              t.lineTo(w - c - p, r + ((100 - h) / 100) * u),
              (t.direction = 'rtl'),
              t.fillText(e.maxText, w - c - p, r + ((100 - h) / 100) * u + 3),
              t.fillText(h, w - c - p, r + ((100 - h) / 100) * u + 15))
            : (t.moveTo(g, r + ((100 - d) / 100) * u + a / 2 - s / 2),
              t.lineTo(g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2),
              (t.direction = 'rtl'),
              t.fillText(e.minText, g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2 + 3),
              t.fillText(d, g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2 + C),
              t.moveTo(w, r + ((100 - h) / 100) * u + a / 2 - s / 2),
              t.lineTo(w - c - p, r + ((100 - h) / 100) * u + a / 2 - s / 2),
              (t.direction = 'rtl'),
              t.fillText(e.maxText, w - c - p, r + ((100 - h) / 100) * u + a / 2 - s / 2 + 3),
              t.fillText(h, w - c - p, r + ((100 - h) / 100) * u + a / 2 - s / 2 + C)))
      : d && !h
      ? n >= o
        ? (t.moveTo(g, r + ((100 - d) / 100) * u), t.lineTo(g - c, r + ((100 - d) / 100) * u), (t.direction = 'rtl'), t.fillText(e.minText, g - c, r + ((100 - d) / 100) * u + 3), t.fillText(d, g - c, r + ((100 - d) / 100) * u + 15))
        : (t.moveTo(g, r + ((100 - d) / 100) * u + a / 2 - s / 2), t.lineTo(g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2), (t.direction = 'rtl'), t.fillText(e.minText, g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2 + 3), t.fillText(d, g - c, r + ((100 - d) / 100) * u + a / 2 - s / 2 + C))
      : h &&
        !d &&
        (n >= o
          ? (t.moveTo(w, r + ((100 - h) / 100) * u), t.lineTo(w - c, r + ((100 - h) / 100) * u), (t.direction = 'rtl'), t.fillText(e.maxText, w - c, r + ((100 - h) / 100) * u + 3), t.fillText(h, w - c, r + ((100 - h) / 100) * u + 15))
          : (t.moveTo(w, r + ((100 - h) / 100) * u + a / 2 - s / 2), t.lineTo(w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2), (t.direction = 'rtl'), t.fillText(e.maxText, w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2 + 3), t.fillText(h, w - c, r + ((100 - h) / 100) * u + a / 2 - s / 2 + C))),
    t.stroke(),
    t.closePath()
}

function Z2(t, e) {
  const { x: i, y: r, width: n, height: o } = e.calculative.worldRect,
    a = n > o ? o / 2 : n / 2
  return (
    eC(t, e),
    e.scaleShow && tC(t, e),
    Kt(
      t,
      {
        x: i + n / 2,
        y: r + o / 2,
        r: a,
      },
      {
        strokeStyle: '#4583FF',
      }
    ),
    !1
  )
}

function Bc(t, e) {
  const { x: i, y: r, height: n, ex: o, ey: a } = e.calculative.worldRect,
    s = n / 7
  t.beginPath(), t.moveTo(i, a - s), t.bezierCurveTo(i, (a - s * 2.5) | 0, o, (a - s * 2.5) | 0, o, a - s), t.stroke()
  const l = (e.calculative.progress || 0) * (n - 2 * s),
    c = a - s - l
  return (
    e.calculative.progress &&
      (t.save(), t.beginPath(), (t.fillStyle = e.calculative.progressColor), t.moveTo(i, c), t.bezierCurveTo(i, (c + (s * 3) / 2) | 0, o, (c + (s * 3) / 2) | 0, o, c), t.lineTo(o, a - s), t.bezierCurveTo(o, (a + s / 2) | 0, i, (a + s / 2) | 0, i, a - s), t.closePath(), t.fill(), t.restore()),
    t.beginPath(),
    // window.pSBC && (t.fillStyle = window.pSBC(-0.4, e.calculative.progressColor)),
    t.moveTo(i, c),
    t.bezierCurveTo(i, (c - (s * 3) / 2) | 0, o, (c - (s * 3) / 2) | 0, o, c),
    t.bezierCurveTo(o, (c + (s * 3) / 2) | 0, i, (c + (s * 3) / 2) | 0, i, c),
    t.closePath(),
    t.fill(),
    t.beginPath(),
    t.moveTo(i, r + s),
    t.bezierCurveTo(i, (r - s / 2) | 0, o, (r - s / 2) | 0, o, r + s),
    t.lineTo(o, a - s),
    t.bezierCurveTo(o, (a + s / 2) | 0, i, (a + s / 2) | 0, i, a - s),
    t.closePath(),
    t.stroke(),
    t.beginPath(),
    t.moveTo(o, r + s),
    t.bezierCurveTo(o, (r + s * 2.5) | 0, i, (r + s * 2.5) | 0, i, r + s),
    t.stroke(),
    !1
  )
}

export const ud = () => {
  return {
    thermometer: X2,
    watermeter: Z2,
    indicatorLight: iC,
    toggleSwitch: oC,
    knifeSwitch: rC,
    thermometer1: AC,
    airSwitch: TC,
    waterTank: Bc,
  }
}
