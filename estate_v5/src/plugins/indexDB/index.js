import localforage from 'localforage'

export const diagramIndexedDB = localforage.createInstance({
  name: 'diagramIndexedDB',
})

export const diagramPreviewIndexDB = localforage.createInstance({
  name: 'diagramPreviewIndexDB',
})

// 存值 diagramIndexedDB.setItem(key, value)

// 取值
// try {
//   const value = await diagramIndexedDB.getItem('somekey');
//   // This code runs once the value has been loaded
//   // from the offline store.
//   console.log(value);
// } catch (err) {
//   // This code runs if there were any errors.
//   console.log(err);
// }

// 删除某项  diagramIndexedDB.removeItem('somekey')

// 重置数据库  diagramIndexedDB.clear()
export const projectIndexDB = localforage.createInstance({
  name: 'projectIndexDB',
})
