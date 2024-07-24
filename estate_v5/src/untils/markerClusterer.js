/**
 * write by 张舟 zhangzhou 2023/09/11
 * 为了解决百度地图点聚合点击聚合图标卡顿问题，重新写一遍并梳理流程
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = (window.BMapLib = BMapLib || {})
;(function () {
  /**
   * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值
   * @param {Map} map BMap.Map的实例化对象
   * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
   * @param {Number} gridSize 要扩大的像素值
   *
   * @return {BMap.Bounds} 返回扩大后的视图范围
   */
  var getExtendedBounds = function (map, bounds, gridSize) {
    // 1.处理边界，让其边界符合百度地图规范
    bounds = cutBoundsInRange(bounds)
    // bounds东北角像素坐标
    var pixelNE = map.pointToPixel(bounds.getNorthEast())
    // bounds西南角像素坐标
    var pixelSW = map.pointToPixel(bounds.getSouthWest())
    // 扩展像素坐标
    pixelNE.x += gridSize
    pixelNE.y -= gridSize
    pixelSW.x -= gridSize
    pixelSW.y += gridSize
    // 计算新的东北角和西南角，并重新生成Bounds返回
    var newNE = map.pixelToPoint(pixelNE)
    var newSW = map.pixelToPoint(pixelSW)
    return new BMap.Bounds(newSW, newNE)
  }

  /**
   * 按照百度地图支持的世界范围对bounds进行边界处理
   * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
   *
   * @return {BMap.Bounds} 返回不越界的视图范围
   */
  var cutBoundsInRange = function (bounds) {
    // getNorthEast() 返回矩形区域的东北角
    var maxX = getRange(bounds.getNorthEast().lng, -180, 180)
    var minX = getRange(bounds.getSouthWest().lng, -180, 180)
    var maxY = getRange(bounds.getNorthEast().lat, -74, 74)
    var minY = getRange(bounds.getSouthWest().lat, -74, 74)
    /**
     * Bounds(sw: Point, ne: Point)
     * 创建一个包含所有给定点坐标的矩形区域。其中sw表示矩形区域的西南角，参数ne表示矩形区域的东北角
     */
    return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY))
  }

  /**
   * 对单个值进行边界处理
   * @param {Number} i 要处理的数值
   * @param {Number} min 下边界值
   * @param {Number} max 上边界值
   *
   * @return {Number} 返回不越界的数值
   */
  var getRange = function (i, min, max) {
    // i值取i和min中较大的那一个，即i不可以超出min这个最小的边界
    min && (i = Math.max(i, min))
    // i值取i和max中较小的那一个，即i不可以超出max这个最大的边界
    max && (i = Math.min(i, max))
    return i
  }

  /**
   * 判断给定的对象是否为数组
   * @param {Object} source 要测试的对象
   * @return {Boolean} 如果是数组返回true,否则返回false
   */
  var isArray = function (source) {
    return '[object Array]' === Object.prototype.toString.call(source)
  }

  /**
   * 返回item在source中的所以位置
   * @param {Object} item 要测试的对象
   * @param {Array} source 数组
   *
   * @return {Number} 如果在数组内，返回索引，否则返回 -1
   */
  var indexOf = function (item, source) {
    var index = -1
    if (isArray(source)) {
      if (source.indexOf) {
        index = source.indexOf(item)
      } else {
        for (var i = 0, m; (m = source[i]); i++) {
          if (m === item) {
            index = i
            break
          }
        }
      }
    }
    return index
  }

  /**
   * MarkerClusterer类
   * @class 用来解决加载大量点的问题，并提高性能
   * @param map 地图实例
   * @param options
   * options:{
   *  markers: Marker[] 要聚合的标记数组
   *  gridSize: Number 聚合计算时网格的像素大小，默认60
   *  maxZoom: Number 最大聚合级别，大于该级别就不进行相应的聚合
   *  minClusterSize: Number 最小的聚合数量，小于改数量的不能成为一个聚合，默认为2
   *  isAverangeCenter: Boolean 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点
   *  styles: IconStyle[] 自定义聚合后的图标风格，请参考TextIconOverlay类
   * }
   */
  console.log('看看有没有BMapLib', BMapLib)
  var MarkerClusterer = (BMapLib.MarkerClusterer = function (map, options) {
    // map实例必传
    if (!map) {
      return false
    }
    // 地图实例
    this._map = map
    // 普通点集合
    this._markers = []
    // 点聚合集合
    this._clusters = []

    // 处理一下传过来的参数
    var opts = options || {}
    this._gridSize = opts['gridSize'] || 60
    this._maxZoom = opts['maxZoom'] || 18
    this._minClusterSize = opts['minClusterSize'] || 2
    this._isAverageCenter = false
    if (opts['isAverageCenter'] != undefined) {
      this._isAverageCenter = opts['isAverageCenter']
    }
    this._styles = opts['styles'] || []

    var that = this

    // 监听地图 zoomend 事件和 moveend 事件
    this._map.addEventListener('zoomend', function () {
      that._redraw()
    })

    this._map.addEventListener('moveend', function () {
      that._redraw()
    })

    var mkrs = opts['markers']
    // 学习：先做判断是不是数组，传入的参数很有必要做判断
    isArray(mkrs) && this.addMarkers(mkrs)
  })

  /**
   * 添加要聚合的标记数组
   * @param {Array<Marker>} markers 要聚合的标记数组
   * @return 无返回值
   */
  MarkerClusterer.prototype.addMarkers = function (markers) {
    for (var i = 0, len = markers.length; i < len; i++) {
      this._pushMarkerTo(markers[i])
    }
    this._createClusters()
  }

  /**
   * 把一个标记添加到要聚合的标记数组中
   * @param {BMap.Marker} marker 要添加的标记
   * @return 无返回值
   */
  MarkerClusterer.prototype._pushMarkerTo = function (marker) {
    var index = indexOf(marker, this._markers)
    if (index === -1) {
      marker.isInCluster = false
      this._markers.push(marker)
    }
  }

  /**
   * 添加一个聚合的标记
   * @param {BMap.Marker} marker 要聚合的单个标记
   */
  MarkerClusterer.prototype.addMarker = function (marker) {
    this._pushMarkerTo(marker)
    this._createClusters()
  }

  /**
   * 根据所给定的标记，创建聚合点
   * @return 无返回值
   */
  MarkerClusterer.prototype._createClusters = function () {
    // 获取地图可视区域，以地理坐标表示
    var mapBounds = this._map.getBounds()
    // 扩展mapBounds
    var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize)
    for (var i = 0, marker; (marker = this._markers[i]); i++) {
      // 如果marker的isInCluster为false，证明该点没有被添加进去
      // Bounds.containsPoint 如果点的地理坐标位于此矩形内，则返回true
      if (!marker.isInCluster && extendedBounds.containsPoint(marker.getPosition())) {
        // 将点添加到最近的聚合中
        this._addToClosestCluster(marker)
      }
    }
  }

  /**
   * 根据marker的位置，把它添加到最近的聚合中
   * @param {BMap.Marker} marker 要进行聚合的单个marker
   *
   * @return 无返回值
   */
  MarkerClusterer.prototype._addToClosestCluster = function (marker) {
    // 指定一个distance
    var distance = 4000000
    // 将要添加进的聚合实例
    var clusterToAddTo = null
    // 点的位置 地理坐标
    var position = marker.getPosition()
    // 遍历所有的聚合数组
    for (var i = 0, cluster; (cluster = this._clusters[i]), i < this._clusters.length; i++) {
      // 获取聚合的中心
      var center = cluster.getCenter()
      if (center) {
        // this._map.getDistance 返回两点之间的距离，单位是米
        // 这里直接用position不就好了吗
        var d = this._map.getDistance(center, position)
        // 400万米相当于山东青岛到新疆乌鲁木齐这么远,先给定一个较远的范围
        if (d < distance) {
          // 找出距离最近的那个聚合
          distance = d
          clusterToAddTo = cluster
        }
      }
    }

    // 如果点在该聚合的边界中就将该点添加进去
    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker)
    } else {
      // 如果不在就创建一个新聚合
      var cluster = new Cluster(this)
      cluster.addMarker(marker)
      this._clusters.push(cluster)
    }
  }

  /**
   * 获取聚合的Map实例
   * @return {Map} Map的实例
   */
  MarkerClusterer.prototype.getMap = function () {
    return this._map
  }

  /**
   * 获取单个聚合的最小数量
   * @return {Number} 单个聚合的最小数量
   */
  MarkerClusterer.prototype.getMinClusterSize = function () {
    return this._minClusterSize
  }

  /**
   * 设置单个聚合的最小数量
   * @param {Number} size 单个聚合的最小数量
   *
   * @return 无返回值
   */
  MarkerClusterer.prototype.setMinClusterSize = function (size) {
    this._minClusterSize = size
    this._redraw()
  }

  /**
   * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心
   * @return {Boolean} true 或 false
   */
  MarkerClusterer.prototype.isAverageCenter = function () {
    return this._isAverageCenter
  }

  /**
   * 获取聚合的样式风格集合
   */
  MarkerClusterer.prototype.getStyles = function () {
    return this._styles
  }

  /**
   * 设置聚合的样式风格集合
   * @param {Array<IconStyle>} styles 样式风格数组
   * @return 无返回值
   */
  MarkerClusterer.prototype.setStyles = function (styles) {
    this._styles = styles
    this._redraw()
  }

  /**
   * 获取聚合的最大缩放级别
   *
   * @return {Number} 聚合的最大缩放级别
   */
  MarkerClusterer.prototype.getMaxZoom = function () {
    return this._maxZoom
  }

  /**
   * 设置聚合的最大缩放级别
   * @param {Number} maxZoom 聚合的最大缩放级别
   *
   * @return false
   */
  MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this._maxZoom = maxZoom
    this._redraw()
  }

  /**
   * 获取网格大小
   * @return {Number} 网格大小
   */
  MarkerClusterer.prototype.getGridSize = function () {
    return this._gridSize
  }

  /**
   * 设置网格大小
   * @param {Number} Size 网格大小
   *
   * @return 无返回值
   */
  MarkerClusterer.prototype.setGridSize = function (size) {
    this._gridSize = size
    this._redraw()
  }

  /**
   * 重新生成, 比如改变了属性等
   * @return 无返回值
   */
  MarkerClusterer.prototype._redraw = function () {
    this._clearLastClusters()
    this._createClusters()
  }

  /**
   * 清除上一次的聚合的结果
   * @return 无返回值
   */
  MarkerClusterer.prototype._clearLastClusters = function () {
    // 遍历_cluster数组，调用cluster的remove方法
    for (var i = 0, cluster; (cluster = this._clusters[i]), i < this._clusters.length; i++) {
      cluster.remove()
    }
    this._clusters = []
    this._removeMarkersFromCluster()
  }

  /**
   * 清除聚合中的所有标志位
   *
   * @return 无返回值
   */
  MarkerClusterer.prototype._removeMarkersFromCluster = function () {
    for (var i = 0, marker; (marker = this._markers[i]), i < this._markers.length; i++) {
      marker.isInCluster = false
    }
  }

  /**
   * 从地图上彻底清除所有标记
   *
   * @return 无返回值
   */
  MarkerClusterer.prototype.clearMarkers = function () {
    // 清除上一次的聚合结果
    this._clearLastClusters()
    // 将地图上的散点清除掉
    this._removeMarkersFromMap()
    this._markers = []
  }

  /**
   * 把所有的marker从地图上清除
   * @return 无返回值
   */
  MarkerClusterer.prototype._removeMarkersFromMap = function () {
    for (var i = 0, marker; (marker = this._markers[i]), i < this._markers.length; i++) {
      marker.isInCluster = false
      this._map.removeOverlay(marker)
    }
  }

  /**
   * 从地图和数据层面删除单个marker
   * @param {BMap.Marker} marker 需要被删除的marker
   *
   * @return {Boolean} 删除成功返回true,否则返回false
   */
  MarkerClusterer.prototype._removeMarker = function (marker) {
    var index = indexOf(marker, this._markers)
    if (index === -1) {
      return false
    }
    this._map.removeOlerlay(marker)
    this._markers.splice(index, 1)
    return true
  }

  /**
   * 删除单个marker并重绘聚合
   * * @param {BMap.Marker} marker 需要被删除的marker
   *
   * @return {Boolean} 删除成功返回true，否则返回false
   */
  MarkerClusterer.prototype.removeMarker = function (marker) {
    var success = this._removeMarker(marker)
    if (success) {
      this._redraw()
    }
    return success
  }

  /**
   * 删除一组marker
   * @param {Array<BMap.Marker>} markers 需要被删除的marker数组
   *
   * @return {Boolean} 删除成功返回true，否则返回false
   */
  MarkerClusterer.prototype.removeMarkers = function (markers) {
    var success = false
    for (var i = 0; i < markers.length; i++) {
      var r = this._removeMarker(markers[i])
      success = success || r
    }
    if (success) {
      this._redraw()
    }
    return success
  }

  /**
   * 获取所以的标记数组
   * @return {Array<Marker>} 标记数组
   */
  MarkerClusterer.prototype.getMarkers = function () {
    return this._markers
  }

  /**
   * 获取聚合的总数量
   * @return {Number} 聚合的总数量
   */
  MarkerClusterer.prototype.getClustersCount = function () {
    var count = 0
    for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
      cluster.isReal() && count++
    }
    return count
  }

  /**
   * Cluster
   * @class 表示一个聚合对象，该聚合，包含有N个marker，这N个marker组成的范围，并有予以显示在Map上的TextIconOverlay
   * @constructor
   * @param {MarkerClusterer} markerClusterer 聚合实例
   */
  function Cluster(markerClusterer) {
    // 总聚合markerClusterer实例
    this._markerClusterer = markerClusterer
    this._map = markerClusterer.getMap()
    this._minClusterSize = markerClusterer.getMinClusterSize()
    this._isAverageCenter = markerClusterer.isAverageCenter()
    // 落脚位置
    this._center = null
    // 这个Cluster中所包含的markers
    this._markers = []
    // 以中心点为准，向四边扩大gridSize个像素范围，即网格范围
    this._gridBounds = null
    // 是否为真聚合
    this._isReal = false
    // 带文字的聚合图标
    this._clusterMarker = new BMapLib.TextIconOverlay(this._center, this._markers.length, { styles: this._markerClusterer.getStyles() })

    // 改为在此处绑定click事件
    var that = this
    this._clusterMarker.addEventListener('click', function (event) {
      var thatMap = that._map
      var thatBounds = that.getBounds()
      // 设置map的Viewport到合适的位置和尺寸
      thatMap.setViewport(thatBounds)
    })
  }

  /**
   * 向该聚合添加一个标记
   * @param {Marker} marker 要添加的标记
   * @return {Boolean}
   */
  Cluster.prototype.addMarker = function (marker) {
    // 如果这个点原本就在该聚合中，就不再进行下一步
    if (this.isMarkerInCluster(marker)) {
      return false
    }
    if (!this._center) {
      // 如果没有_center属性则将center设置为第一个marker的坐标
      this._center = marker.getPosition()
      // 更新聚合的网格边界
      this.updateGridBounds()
    } else {
      if (this._isAverageCenter) {
        // 因为加了一个点，所以需要加1
        var l = this.markers.length + 1
        // 计算平均纬度
        var lat = (this._center.lat * (l - 1) + marker.getPosition().lat) / l
        // 计算平均经度
        var lng = (this._center.lng * (l - 1) + marker.getPosition().lng) / l
        // 更新聚合网格边界
        this._center = new BMap.Point(lng, lat)
        this.updateGridBounds()
      }
    }

    marker.isInCluster = true
    this._markers.push(marker)

    var len = this._markers.length
    if (len < this._minClusterSize) {
      // 如果markers的长度小于minClusterSize，就将marker直接添加到map中
      this._map.addOverlay(marker)
      return true
    } else if (len === this._minClusterSize) {
      // 如果markers的长度等于minClusterSize就遍历将之前添加到地图的marker全部移除，此处有效率低下卡顿的嫌疑
      for (var i = 0; i < len; i++) {
        this._markers[i].getMap() && this._map.removeOverlay(this._markers[i])
      }
    }

    // 将_clusterMarker添加到地图上，此时上面的数量还是上次的，位置也是上次的
    this._map.addOverlay(this._clusterMarker)
    this._isReal = true
    this.updateClusterMarker()
    return true
  }

  /**
   * 判断一个标记是否在该聚合中
   * @param {Marker} marker 要判断的标记
   *
   * @return {Boolean} true或false
   */
  Cluster.prototype.isMarkerInCluster = function (marker) {
    return indexOf(marker, this._markers) !== -1
  }

  /**
   * 更新该聚合的网格范围
   *
   * @return 无返回值
   */
  Cluster.prototype.updateGridBounds = function () {
    // 设置初始的边界，位置仅仅包含this._center这个点
    var bounds = new BMap.Bounds(this._center, this._center)
    // 将网格上下所有扩大gridSize像素
    this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize())
  }

  /**
   * 更新该聚合的显示样式，也即TextIconOverlay
   * @return 无返回值
   */
  Cluster.prototype.updateClusterMarker = function () {
    // 当前地图的缩放级别是否大于最大聚合缩放级别
    if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
      // 删除地图上的聚合图标
      this._clusterMarker && this._map.removeOverlay(this._clusterMarker)
      // 将该聚合中的点添加到地图上
      for (var i = 0, marker; (marker = this._markers[i]), i < this._markers.length; i++) {
        this._map.addOverlay(marker)
      }
      return
    }

    if (this._markers.length < this._minClusterSize) {
      // 如果markers的长度小于最小聚合数量，就将聚合图标隐藏起来
      // 问题：隐藏起来了那这个聚合中的点怎么办
      this._clusterMarker.hide()
      return
    }

    // 更新图标的位置和文字
    this._clusterMarker.setPosition(this._center)

    this._clusterMarker.setText(this._markers.length)

    // var thatMap = this._map
    // var thatBounds = this.getBounds()
    // 给点聚合标记绑定click事件,此处因多次绑定事件会造成卡顿
    // this._clusterMarker.addEventListener("click",function(event) {
    //     // 设置map的Viewport到合适的位置和尺寸
    //     thatMap.setViewport(thatBounds)
    // })
  }

  /**
   * 获取该聚合所包含的所有marker的最小外接矩形范围
   *
   * @return {BMap.Bounds} 计算出的范围
   */
  Cluster.prototype.getBounds = function () {
    var bounds = new BMap.Bounds(this._center, this._center)
    for (var i = 0, marker; (marker = this._markers[i]), i < this._markers.length; i++) {
      // 放大此矩形，使其包含给定的点
      bounds.extend(marker.getPosition())
    }
    return bounds
  }

  /**
   * 获取该聚合的落脚点
   * @return {BMap.Point} 该聚合的落脚点
   */
  Cluster.prototype.getCenter = function () {
    return this._center
  }

  /**
   * 判断一个标记是否在聚合网格范围中
   * @param {Marker} marker 要判断的标记
   *
   * @return {Boolean} true或false
   */
  Cluster.prototype.isMarkerInClusterBounds = function (marker) {
    return this._gridBounds.containsPoint(marker.getPosition())
  }

  /**
   * 删除该聚合
   * @return 无返回值
   */
  Cluster.prototype.remove = function () {
    // 清除散点
    for (var i = 0, m; (m = this._markers[i]), i < this._markers.length; i++) {
      // 将所有点的isInCluster改为false
      this._markers[i].isInCluster = false
      this._markers[i].getMap() && this._map.removeOverlay(this._markers[i])
    }
    // 清除掉聚合标记
    this._map.removeOverlay(this._clusterMarker)
    this._markers.length = 0
    delete this._markers
  }

  /**
   * 获取该聚合是否为真聚合
   *
   * @return {Boolean}
   */
  Cluster.prototype.isReal = function (marker) {
    return this._isReal
  }
})()
