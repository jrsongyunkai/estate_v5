// 电量转碳排放 0.604 kgCO₂ / KW·h
export const powerToCarbon = p => p * 0.604

export const roundPrecision = (n, precision) => {
  const e = 10 ** precision
  return Math.round(n * e) / e
}

// 计算两点之间的距离
const getDistance = (p1, p2) => {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

const findFarthestPoint = points => {
  let maxDistance = 0
  let maxIndex = -1
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      const d = getDistance(points[i], points[j])
      if (d > maxDistance) {
        maxDistance = d
        maxIndex = i
      }
    }
  }
  return { distance: maxDistance, index: maxIndex }
}

// 计算包围圆的半径和圆心
export const getBoundingCircle = points => {
  // 找到点集的最左下角和最右上角的点
  let minX = points[0].x
  let minY = points[0].y
  let maxX = points[0].x
  let maxY = points[0].y
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x)
    minY = Math.min(minY, points[i].y)
    maxX = Math.max(maxX, points[i].x)
    maxY = Math.max(maxY, points[i].y)
  }
  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
  const initialRadius = getDistance(center, { x: maxX, y: maxY })

  // 迭代扩大圆的半径
  let boundingCircle = { center, radius: initialRadius }
  for (let i = 0; i < 100; i++) {
    // 迭代次数可根据实际情况调整
    const farthestPoint = findFarthestPoint(points, boundingCircle.center)
    boundingCircle = {
      center: boundingCircle.center,
      radius: farthestPoint.distance,
    }
  }

  return boundingCircle
}
